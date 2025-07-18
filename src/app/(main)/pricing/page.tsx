"use client"

import { Button } from "@/components/ui/button";

import { authClient } from "@/lib/auth-client";


export default function PricingPage() {
    return (
        <Button onClick={async () => {
            await authClient.subscription.upgrade({
                plan: "starter_monthly",
                successUrl: "/dashboard",
                cancelUrl: "/pricing",

            });
        }} className="w-full">Start free trial</Button>

    );
}

