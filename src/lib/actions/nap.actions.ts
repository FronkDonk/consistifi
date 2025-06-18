"use server";

import { z } from "zod";
import { authenticatedAction } from "./safe-action";
import { placesClient } from "../google";
import { chromium } from "playwright";

export const google = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      businessName: z.string(),
      address: z.string(),
      phoneNumber: z.string(),
    }),
  )
  .handler(async ({ input }) => {
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
      phoneNumber: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const browser = await chromium.launch({ headless: true });

    const page = await browser.newPage();
    const query = `${input.businessName} ${input.address}`;

    try {
      await page.goto("https://www.bing.com/maps");

      const searchInput = page.locator("input#maps_sb");
      await searchInput.fill(query);
      await searchInput.press("Enter");
      await page.waitForSelector(".b_entityTP", { timeout: 10000 });

      await page.screenshot({ path: "bing_maps_result.png", fullPage: true });

      const name = await page.locator(".nameContainer").first().innerText();
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
      phoneNumber: z.string(),
    }),
  )
  .handler(async ({ /* ctx, */ input }) => {
    const { businessName } = input;
    const query = `${businessName}`;
    const browser = await chromium.launch({ headless: true });

    try {
      const page = await browser.newPage();
      await page.goto("https://maps.apple.com/search");

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

export const scanNapData = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      businessName: z.string(),
      address: z.string(),
    }),
  )
  .handler(async ({ input }) => {});
