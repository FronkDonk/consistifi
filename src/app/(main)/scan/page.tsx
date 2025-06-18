import { Form } from '@/components/ui/form'
import React from 'react'
import { BusinessInfoForm } from './business-info-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ScanPage() {
    return (
        <main className='max-w-7xl mx-auto flex flex-col gap-5'>
            <div>
                <h1 className='typography-h2'>Lets check your business listings</h1>
                <p className='typography-p'>Paste the URLs to your business listings below. We only need your Google listing to get started.</p>
            </div>
            <div className='flex gap-5 '>
                <BusinessInfoForm />
                <Card className='bg-green-100 w-1/4'>
                    <CardHeader>
                        <CardTitle>What we&apos;ll check.</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className='typography-list'>
                            <li>Business name consistency</li>
                            <li>Address formatting</li>
                            <li>Phone number mismatches</li>
                            <li>Missing information</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
