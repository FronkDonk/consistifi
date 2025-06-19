import { scanBusinessInfo } from '@/lib/actions/nap.actions'
import React from 'react'

export default async function ScanResultPage() {
    const data = await scanBusinessInfo()

    console.log(data)
    return (
        <div>page</div>
    )
}
