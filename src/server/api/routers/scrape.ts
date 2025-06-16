import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { chromium } from "playwright";
import { placesClient } from "@/lib/google";
export const scrapeRouter = createTRPCRouter({
  bing: publicProcedure
    .input(
      z.object({
        businessName: z.string(),
        address: z.string(),
        phoneNumber: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { businessName, address, phoneNumber } = input;
      const browser = await chromium.launch({ headless: true });

      const page = await browser.newPage();
      const query = `${businessName} ${address}`;

      try {
        await page.goto("https://www.bing.com/maps");

        const searchInput = page.locator("input#maps_sb");
        await searchInput.fill(query);
        await searchInput.press("Enter");
        await page.waitForSelector(".b_entityTP", { timeout: 10000 });

        await page.screenshot({ path: "bing_maps_result.png", fullPage: true });
        const name = await page.locator(".nameContainer").first().innerText();
        const addressElement = await page
          .locator(".iconDataList")
          .first()
          .innerText();
        const phoneNumber = await page
          .locator('a[href^="tel:"]')
          .first()
          .innerText();
        console.log("📞 Phone number:", phoneNumber);
        console.log("🏢 Name:", name);
        console.log("📍 Address:", addressElement);
      } finally {
        await browser.close();
      }
    }),
  google: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .query(async () => {
      const request = {
        textQuery: "Tacos in Mountain View",
        includedType: "restaurant",
        isOpenNow: true,
        language: "en-US",
        maxResultCount: 8,
        minRating: 3.2,
        region: "us",
        useStrictTypeFiltering: false,
      };

      // The field mask as a header
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
          textQuery: "Charlies Kök ab",
          regionCode: "SE",
        },
        callOptions,
      );

      console.log(
        res?.[0]?.places?.[0]?.formattedAddress ?? "No address found",
      );
      console.log(
        res?.[0]?.places?.[0]?.nationalPhoneNumber ?? "No phone found",
      );
      console.log(res?.[0]?.places?.[0]?.displayName?.text ?? "No name found");
    }),
});
