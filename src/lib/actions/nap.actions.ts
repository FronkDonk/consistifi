"use server";

import { z } from "zod";
import { authenticatedAction } from "./safe-action";
import { placesClient } from "../google";
import { chromium } from "playwright";
import { db } from "@/db/drizzle";
import { scan, scanResults, userBusiness } from "@/db/schema";
import { redirect } from "next/navigation";
import { CountryCode, parsePhoneNumberWithError } from "libphonenumber-js";
import { parse } from "path";

export const google = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      businessName: z.string(),
      address: z.string(),
      lat: z.string(),
      lng: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const { lat, lng } = input;
    const callOptions = {
      otherArgs: {
        headers: {
          "X-Goog-FieldMask":
            "places.formattedAddress,places.nationalPhoneNumber,places.displayName",
        },
      },
    };
    const res = await placesClient.searchText(
      {
        textQuery: input.businessName,
        locationBias: {
          circle: {
            center: {
              latitude: Number(lat),
              longitude: Number(lng),
            },
            radius: 10000, // radius in meters, adjust as needed
          },
        },
      },
      callOptions,
    );

    console.log(res?.[0]?.places?.[0]?.formattedAddress ?? "No address found");
    console.log(res?.[0]?.places?.[0]?.nationalPhoneNumber ?? "No phone found");
    console.log(res?.[0]?.places?.[0]?.displayName?.text ?? "No name found");

    return {
      source: "google",
      address: res?.[0]?.places?.[0]?.formattedAddress,
      phone: res?.[0]?.places?.[0]?.nationalPhoneNumber,
      businessName: res?.[0]?.places?.[0]?.displayName?.text,
    };
  });

export const bing = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      businessName: z.string(),
      address: z.string(),
      lat: z.string(),
      lng: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const browser = await chromium.launch({ headless: true });

    const page = await browser.newPage();
    const query = `${input.businessName} ${input.address}`;

    try {
      await page.goto(`https://www.bing.com/maps?cp=${input.lat}~${input.lng}`);
      const searchInput = page.locator("input#maps_sb");
      await searchInput.fill(query);

      await searchInput.press("Enter");

      await page.screenshot({ path: "bing_maps_result.png", fullPage: true });

      await page.waitForSelector(".nameContainer", { timeout: 10000 });

      await page.screenshot({ path: "bing_maps_result.png", fullPage: true });

      const name = await page.$eval(".nameContainer", (el) => {
        // Get only the direct text content, excluding nested buttons
        return Array.from(el.childNodes)
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => (node.textContent ?? "").trim())
          .join("");
      });
      const address = await page.locator(".iconDataList").first().innerText();
      const phone = await page.locator('a[href^="tel:"]').first().innerText();

      return {
        source: "bing",
        businessName: name,
        address: address,
        phone: phone,
      };
    } finally {
      await browser.close();
    }
  });

export const apple = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      businessName: z.string(),
      address: z.string(),
      lat: z.string(),
      lng: z.string(),
    }),
  )
  .handler(async ({ /* ctx, */ input }) => {
    const { businessName } = input;
    const query = `${businessName}`;
    const browser = await chromium.launch({ headless: true });

    try {
      const page = await browser.newPage();
      await page.goto(
        `https://maps.apple.com/search?center=${input.lat}%2C${input.lng}`,
      );

      const searchInput = page.locator("input#mw-search-input");
      await searchInput.fill(query);
      await searchInput.press("Enter");

      await page.waitForSelector(".sc-container-inner", { timeout: 10000 });
      await page.screenshot({
        path: "apple_maps_result.png",
        fullPage: true,
      });
      const name = await page
        .locator(".sc-container-inner h1")
        .first()
        .innerText();

      const addressParts = await page
        .locator("a[data-directions-link] .mw-dir-label")
        .allTextContents();

      const fullAddress = addressParts.join(", ");

      const phoneNumber = await page
        .locator('a[href^="tel:"] bdo.sc-phone-number')
        .first()
        .innerText();

      return {
        source: "apple",
        businessName: name,
        address: fullAddress,
        phone: phoneNumber,
      };
    } finally {
      await browser.close();
    }
  });

export const BusinessSearchAutoComplete = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      businessName: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const { businessName } = input;
    const res = await placesClient.autocompletePlaces({
      input: businessName,
    });

    return res[0]?.suggestions;
  });

export const saveBusinessInfo = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      businessName: z.string(),
      address: z.string(),
      placeId: z.string(),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const { businessName, placeId } = input;
    const user = ctx.user;
    try {
      console.log("Saving business info for user:", user.id);
      const callOptions = {
        otherArgs: {
          headers: {
            "X-Goog-FieldMask":
              "formattedAddress,location,displayName,postalAddress,nationalPhoneNumber",
          },
        },
      };

      console.log("Fetching place details for placeId:", placeId);
      const res = await placesClient.getPlace(
        {
          name: `places/${placeId}`,
        },
        callOptions,
      );
      console.log("Place details:", res[0]);

      const formattedAddress = res[0].formattedAddress;
      const lat = res[0].location?.latitude;
      const lng = res[0].location?.longitude;
      const regionCode = res[0].postalAddress?.regionCode;
      const phone = res[0].nationalPhoneNumber;

      await db.insert(userBusiness).values({
        // @ts-expect-error Weird fkn bug in drizzle
        userId: user.id,
        businessName,
        address: formattedAddress,
        regionCode,
        lat,
        lng,
        phone,
      });
    } catch (error) {
      console.log(error);
    }

    redirect("/scan/results");
  });

export const scanBusinessInfo = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      scanId: z.string(),
    }),
  )
  .handler(async ({ ctx }) => {
    const user = ctx.user;

    const existingScan = await db.query.scan.findFirst({
      where: (scan, { eq }) => eq(scan.userId, user.id),
      with: {
        scanResults: true,
      },
    });

    if (existingScan) {
      return existingScan.scanResults.map((result) => {
        return {
          source: result.source,
          result: result.results,
          businessName: result.businessName,
          address: result.address,
          phone: result.phone,
        };
      });
    }

    const businessData = await db.query.userBusiness.findFirst({
      where: (userBusiness, { eq }) => eq(userBusiness.userId, user.id),
    });

    if (!businessData) {
      console.log("No business data found for user:", user.id);
      redirect("/scan");
    }

    const { businessName, address, lat, lng, phone, regionCode } = businessData;

    const [
      [googleData, googleError],
      [bingData, bingError],
      [appleData, appleError],
    ] = await Promise.all([
      google({ businessName, address, lat, lng }),
      bing({ businessName, address, lat, lng }),
      apple({ businessName, address, lat, lng }),
    ]);

    if (googleError || bingError || appleError) {
      console.error("Error fetching business data:", {
        googleError,
        bingError,
        appleError,
      });
      return;
    }

    const sources = [googleData, bingData, appleData];

    const [
      [googleResult, googleResultError],
      [bingResult, bingResultError],
      [appleResult, appleResultError],
    ] = await Promise.all(
      sources.map(
        ({
          address: externalAddress,
          phone: externalPhone,
          businessName: externalName,
          source,
        }) =>
          checkBusinessConsistency({
            source,
            userAddress: address,
            address: externalAddress ?? "",
            userBusinessName: businessName,
            businessName: externalName ?? "",
            userPhone: phone,
            phone: externalPhone ?? "",
            regionCode,
          }),
      ),
    );

    const consistencyResults = [
      {
        source: "google",
        result: googleResult,
        data: googleData,
      },
      {
        source: "bing",
        result: bingResult,
        data: bingData,
      },
      {
        source: "apple",
        result: appleResult,
        data: appleData,
      },
    ];

    const scanId = crypto.randomUUID();

    await Promise.all(
      consistencyResults.map(async ({ source, result, data }) => {
        await db.insert(scanResults).values({
          // @ts-expect-error Weird fkn bug in drizzle
          scanId,
          source,
          businessName: data.businessName,
          address: data.address,
          phone: data.phone,
          results: result,
        });
      }),
    );

    return consistencyResults;
  });

export const checkBusinessConsistency = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      source: z.string(),
      userBusinessName: z.string(),
      businessName: z.string(),
      userAddress: z.string(),
      address: z.string(),
      userPhone: z.string(),
      phone: z.string(),
      regionCode: z.string(),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const {
      userBusinessName,
      businessName,
      userAddress,
      address,
      userPhone,
      phone,
      regionCode,
      source,
    } = input;

    console.log("CHECKING BUSINESS CONSISTENCY");
    let phoneMatch = false;
    let addressMatch = false;
    let businessNameMatch = false;

    // --- PHONE COMPARISON ---
    try {
      console.log("Parsing phone numbers:", userPhone, phone, regionCode);
      const phone1 = parsePhoneNumberWithError(
        userPhone,
        regionCode as CountryCode,
      );
      const phone2 = parsePhoneNumberWithError(
        phone,
        regionCode as CountryCode,
      );

      if (phone1.number === phone2.number) {
        phoneMatch = true;
        console.log("Phone numbers match:", phone1.number);
      }
    } catch (e) {
      console.warn("Phone parse error:", e);
    }

    const normalizedUserBusinessName = normalizeNameStrict(userBusinessName);
    const normalizedBusinessName = normalizeNameStrict(businessName);

    if (normalizedUserBusinessName === normalizedBusinessName) {
      businessNameMatch = true;
      console.log(
        "Business names match:",
        normalizedUserBusinessName,
        normalizedBusinessName,
      );
    }
    const callOptions = {
      otherArgs: {
        headers: {
          "X-Goog-FieldMask": "places.formattedAddress,places.displayName",
        },
      },
    };
    try {
      if (!address || !userAddress) {
        console.error("Missing address or userAddress:", {
          address,
          userAddress,
        });
      }
      console.log(address);
      console.log(userAddress);
      const [res, res2] = await Promise.all([
        await placesClient.searchText(
          {
            textQuery: address,
          },
          callOptions,
        ),
        await placesClient.searchText(
          {
            textQuery: userAddress,
          },
          callOptions,
        ),
      ]);

      console.log("Address search results:", res, res2);

      const normalizedUserAddress =
        res?.[0]?.places?.[0]?.formattedAddress ?? "";
      const normalizedAddress = res2?.[0]?.places?.[0]?.formattedAddress ?? "";

      if (
        normalizedAddress &&
        normalizedUserAddress &&
        normalizedUserAddress === normalizedAddress
      ) {
        addressMatch = true;
      }

      return {
        source,
        phoneMatch,
        businessNameMatch,
        addressMatch,
      };
    } catch (error) {
      console.error("Error during address search:", error);
    }
  });

export async function normalizeNameStrict(name: string, soft = false) {
  let result = name
    .toLowerCase()
    .replace(/[\p{P}$+<=>^`|~]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

  if (soft) {
    result = result.replace(/\b(ab|llc|inc|corp|ltd)\b/g, "").trim();
  }

  return result;
}
