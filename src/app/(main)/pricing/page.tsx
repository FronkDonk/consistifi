"use client"
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface Pricing6Props {
    heading: string;
    description?: string;
    price?: string | number;
    priceSuffix?: string;
    features?: string[][];
    buttonText?: string;
}

const defaultFeatures = [
    ["Unlimited", "Integrations", "24/7 support"],
    ["Live collaborations", "Unlimited storage", "30-day money back"],
    ["Unlimited members", "Customization", "Unlimited users"],
];
export default function Pricing6({
    description = "Simple pricing with a free 7 day trial.",
    price = 19,
    priceSuffix = "/mo",
    features = defaultFeatures,
    buttonText = "Start free trial",
}: Pricing6Props) {
    return (
        <section className="py-32">
            <div className="container">
                <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
                    <h2 className="text-4xl font-semibold text-pretty lg:text-6xl">
                        Pricing
                    </h2>
                    <p className="max-w-md text-muted-foreground lg:text-xl">
                        Simple pricing with a free 7 day trial.
                    </p>
                    <div className="mx-auto flex w-full flex-col rounded-lg border p-6 sm:w-fit sm:min-w-80">
                        <div className="flex justify-center">
                            <span className="text-lg font-semibold">$</span>
                            <span className="text-6xl font-semibold">19</span>
                            <span className="self-end text-muted-foreground">
                                /mo
                            </span>
                        </div>
                        <div className="my-6">
                            {features.map((featureGroup, idx) => (
                                <div key={idx}>
                                    <ul className="flex flex-col gap-3">
                                        {featureGroup.map((feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center justify-between gap-2 text-sm font-medium"
                                            >
                                                {feature} <Check className="inline size-4 shrink-0" />
                                            </li>
                                        ))}
                                    </ul>
                                    {idx < features.length - 1 && <Separator className="my-6" />}
                                </div>
                            ))}
                        </div>

                        <Button onClick={async () => {
                            await authClient.subscription.upgrade({
                                plan: "starter monthly",
                                successUrl: "/dashboard",
                                cancelUrl: "/pricing",

                            });
                        }} className="w-full">Start free trial</Button>

                    </div>
                </div>
            </div>
        </section>
    );
}

