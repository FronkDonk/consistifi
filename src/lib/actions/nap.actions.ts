"use server";

import { z } from "zod";
import { authenticatedAction } from "./safe-action";
import { placesClient } from "../google";
import { chromium } from "playwright";
import { db } from "@/db/drizzle";
import { userBusiness } from "@/db/schema";
import { redirect } from "next/navigation";

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
      console.log("📞 Phone number:", phone);
      console.log("🏢 Name:", name);
      console.log("📍 Address:", address);
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

      console.log("📞 apple Phone number:", phoneNumber);
      console.log("🏢 apple Name:", name);
      console.log("📍 apple Address:", fullAddress);
    } finally {
      await browser.close();
    }
  });

export const AddressSearchAutoComplete = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      address: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const { address } = input;
    const res = await placesClient.autocompletePlaces({
      input: address,
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
            "X-Goog-FieldMask": "formattedAddress,location,displayName",
          },
        },
      };

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
      const country = res[0].displayName?.languageCode;

      await db.insert(userBusiness).values({
        // @ts-expect-error Weird fkn bug in drizzle
        userId: user.id,
        businessName,
        address: formattedAddress,
        country,
        lat,
        lng,
      });
    } catch (error) {
      console.log(error);
    }

    redirect("/scan/results");
  });

export const scanBusinessInfo = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    const user = ctx.user;
    console.log("Scanning business info for user:", user.id);
    const businessData = await db.query.userBusiness.findFirst({
      where: (userBusiness, { eq }) => eq(userBusiness.userId, user.id),
    });

    if (!businessData) {
      console.log("No business data found for user:", user.id);
      redirect("/scan");
    }

    const { businessName, address, lat, lng } = businessData;

    const [] = await Promise.all([
      google({ businessName, address, lat, lng }),
      bing({ businessName, address, lat, lng }),
      apple({ businessName, address, lat, lng }),
    ]);
  });
