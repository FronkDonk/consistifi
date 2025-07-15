import React from 'react'
import { ListingResultCard } from './listing-result-card'
import { scanBusinessInfo } from '@/lib/actions/nap.actions'

export async function ScanResults() {
    const [data, error] = await scanBusinessInfo()

    if (error) {
        console.error("Error fetching business info:", error)
    }


    return (
        <section className='grid grid-cols-2 gap-5 mt-5'>

            {data?.map((result, i) => (
                <ListingResultCard
                    key={i}
                    source={result.source}
                    businessName={result.businessName || ""}
                    address={result.address || ""}
                    phone={result.phone || ""}
                    result={result.result}
                />
            ))}
        </section>
    )
}
