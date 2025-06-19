import { scanBusinessInfo } from '@/lib/actions/nap.actions'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircleIcon, CheckIcon, MessageCircleWarningIcon, TriangleAlertIcon, UserRoundCheckIcon } from 'lucide-react'

export default async function ScanResultPage() {
    /*     const [data, error] = await scanBusinessInfo()
     */
  /*   if (error) {
        console.error("Error fetching business info:", error)
    }

    console.log("Fetched business info:", data) */

/*     console.log(data)
 */    return (
        <main className='max-w-7xl mx-auto'>
            <Card>
                <CardHeader>
                    <CardTitle className='typography-h4'>
                        Current Business Information
                    </CardTitle>
                </CardHeader>

                <CardContent className='flex gap-80 '>
                    <div>
                        <p className='font-bold'>Business name</p>
                        <p>Joes pizza</p>
                    </div>
                    <div>
                        <p className='font-bold'>Address</p>
                    </div>
                    <div>
                        <p className='font-bold'>Phone</p>

                    </div>
                </CardContent>
            </Card>
            <h3 className='typography-h4'>Platform scan results</h3>
            <Card>
                <CardContent>
                    <Table className=''>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Brand</TableHead>
                                <TableHead>Business name</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Phone</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-bold capitalize">Google</TableCell>
                                <TableCell className="">
                                    <div className='flex items-center gap-1 '>
                                        Joes Pizza
                                        <CheckCircleIcon className='stroke-green-500' />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex items-center gap-1 '>
                                        123 Main St, Springfield, IL
                                        <CheckCircleIcon className='stroke-green-500' />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex items-center gap-1 '>
                                        (123) 456-7890
                                        <CheckCircleIcon className='stroke-green-500' />
                                    </div>
                                </TableCell>
                            </TableRow>
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
                        </TableBody>
                        {/*  <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3}>Total</TableCell>
                                <TableCell className="text-right">$2,500.00</TableCell>
                            </TableRow>
                        </TableFooter> */}
                    </Table>
                </CardContent>
            </Card>
            <Card className='w-1/2'>
                <CardHeader>
                    <CardTitle className='typography-h4'>Google</CardTitle>
                    <CardDescription>
                        {/* Icon */} Need Attention
                    </CardDescription>
                </CardHeader>
                <CardContent className='flex justify-between'>
                    <section className=''>
                        Your data
                    </section>
                    <aside>
                        found on google
                    </aside>
                </CardContent>

            </Card>
            <Card className='w-1/2'>
                <CardHeader>
                    <CardTitle className='typography-h4'>Google</CardTitle>
                    <CardDescription>
                        {/* Icon */} Need Attention
                    </CardDescription>
                </CardHeader>
                <CardContent className='flex justify-between'>
                    <section className=''>
                        Your data
                    </section>
                    <aside>
                        found on google
                    </aside>
                </CardContent>

            </Card>
            <div>

            </div>
        </main>
    )
}
