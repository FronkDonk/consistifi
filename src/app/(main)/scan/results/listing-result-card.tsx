import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ListingResultCard({
    source,
    businessName,
    address,
    phone,
    result
}: {
    source: string
    businessName: string
    address: string
    phone: string
    result: {
        phoneMatch: boolean
        businessNameMatch: boolean
        addressMatch: boolean
    } | null | undefined
}) {
    return (
        <Card>
            <CardHeader className='flex justify-between'>
                <div>
                    <CardTitle className='typography-h4'>{source}</CardTitle>
                    <CardDescription>
                        {/* Icon */} Need Attention
                    </CardDescription>
                </div>
                <div>
                    <Button>View Listing</Button>
                </div>
            </CardHeader>
            <CardContent className='flex justify-between'>
                <section className=''>
                    <p><span className='font-bold'>Your Information</span></p>
                    <p><span className='font-bold'>Name:</span> Joe's Pizza Palace</p>
                    <p><span className='font-bold'>Phone:</span> (555) 123-4567</p>
                    <p><span className='font-bold'>Address:</span> 123 Main St, Anytown, CA 90210</p>
                    {/* Either this data should be google or just be what the user inputs in the form */}
                </section>
                <aside>
                    <p><span className='font-bold'>Found on Google My Business</span></p>
                    <p><span className='font-bold'>Name:</span>{businessName} {result?.businessNameMatch ? "match" : "no match"}</p>
                    <p><span className='font-bold'>Phone:</span>{phone} {result?.phoneMatch ? "match" : "no match"}</p>
                    <p><span className='font-bold'>Address:</span>{address} {result?.addressMatch ? "match" : "no match"}</p>
                </aside>
            </CardContent>

        </Card>
    )
}
