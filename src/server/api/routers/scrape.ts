import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { chromium } from "playwright";
import { placesClient } from "@/lib/google";
export const scrapeRouter = createTRPCRouter({
  geocoding: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { address } = input;

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${process.env.GOOGLE_PLACES_API_KEY}`,
      );
    }),
});
