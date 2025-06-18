import { auth } from "@/lib/auth";
import { api } from "@/trpc/server";
import { headers } from "next/headers";
import Image from "next/image";
import { Hero } from "./hero";
import { Features } from "./features";
import { scanBusinessInfo } from "@/lib/actions/nap.actions";

export default async function Home() {
  scanBusinessInfo();
  return (
    <main>
      <Hero />
      <Features />
    </main>
  );
}
