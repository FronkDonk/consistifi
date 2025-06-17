import { auth } from "@/lib/auth";
import { api } from "@/trpc/server";
import { headers } from "next/headers";
import Image from "next/image";
import { Hero } from "./hero";
import { Features } from "./features";

export default async function Home() {
  api.scrape.bing({ businessName: "Nya Plåt G Isaksson AB", address: "Fogdevägen 51, 903 55 Umeå", phoneNumber: 90120912 })
  api.scrape.google({ name: "Nya Plåt G Isaksson AB" })
  api.scrape.apple({ businessName: "Nya Plåt G Isaksson AB", address: "Fogdevägen 51, 903 55 Umeå", phoneNumber: 90120912 })

  return (
    <main>
      <Hero />
      <Features />
    </main>
  );
}
