import { scanBusinessInfo } from '@/lib/actions/nap.actions'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircleIcon, CheckIcon, MessageCircleWarningIcon, TriangleAlertIcon, UserRoundCheckIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ListingResultCard } from './listing-result-card'
import { Label } from '@/components/ui/label'

export default async function ScanResultPage() {
    const [data, error] = await scanBusinessInfo()


  /*   if (error) {
        console.error("Error fetching business info:", error)
    }

    console.log("Fetched business info:", data) */

/*     console.log(data)
 */    return (
        <main className='max-w-7xl mx-auto'>
            <header className=''>
                <h1 className='typography-h1 text-left'>Scan Results</h1>
                <p className='typography-h4 text-muted-foreground'>Here&apos;s what we found for Joe&apos;s Pizza Palace            </p>
            </header>
            <Card>
                <CardContent>
                    <CardTitle className='typograph-h4'>Summary overview</CardTitle>
                    <div className='flex'>
                        <p>Google</p>
                        <Badge variant="outline">All good</Badge>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='typography-h4'>
                        Your Submitted information
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <Label>Business name:</Label>
                    <Label>Address:</Label>
                    <Label>Phone:</Label>
                </CardContent>
            </Card>
            <section className='grid grid-cols-2 gap-5 mt-5'>

                {/*  {data?.map((result, i) => (
                    <ListingResultCard
                        key={i}
                        source={result.source}
                        businessName={result.businessName || ""}
                        address={result.address || ""}
                        phone={result.phone || ""}
                        result={result.result}
                    />
                ))} */}
            </section>
        </main>
    )
}
{/*  {data?.map((result, index) => (
                                <TableRow key={result.source}>
                                    <TableCell className="font-bold capitalize">{result.source}</TableCell>
                                    <TableCell className="">
                                        <div className='flex items-center gap-1 '>
                                            {result.businessName}
                                            {result.result?.businessNameMatch ? <CheckCircleIcon className='stroke-green-500' /> : <TriangleAlertIcon className='stroke-destructive' />}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-1 '>
                                            {result.address}
                                            {result.result?.addressMatch ? <CheckCircleIcon className='stroke-green-500' /> : <TriangleAlertIcon className='stroke-destructive' />}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-1 '>
                                            {result.phone}
                                            {result.result?.phoneMatch ? <CheckCircleIcon className='stroke-green-500' /> : <TriangleAlertIcon className='stroke-destructive' />}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))} */}