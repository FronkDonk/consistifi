"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { saveBusinessInfo } from "@/lib/actions/nap.actions"
import { BusinessSearch } from "./business-search"

const formSchema = z.object({
    businessName: z.string().nonempty("Business name is required"),
    address: z.string().nonempty("Address is required"),
    placeId: z.string().nonempty("Place ID is required"),
})

export function BusinessInfoForm() {
    const [selectedBusiness, setSelectedBusiness] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            businessName: "",
            address: "",
            placeId: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        await saveBusinessInfo(values)
    }

    function appendFormValue({ selectedBusinessName, address, placeId }: { selectedBusinessName: string, address: string, placeId: string }) {
        form.setValue("businessName", selectedBusinessName)
        form.setValue("address", address)
        form.setValue("placeId", placeId)
    }


    return (
        <Card className="w-3/4">
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Business name</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                            }
                        /> */}
                        <div className="space-y-2">
                            <Label className="font-bold">Business name</Label>
                            <BusinessSearch appendFormValue={appendFormValue} selectedBusiness={selectedBusiness} setSelectedBusiness={setSelectedBusiness} />
                        </div>
                        <Button className="w-full" type="submit" > Submit</Button >
                    </form>
                </Form >
            </CardContent >
        </Card >
    )
}