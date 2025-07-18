import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/db/drizzle"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashBoardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const user = session?.user

  if (!user) {
    redirect("/sign-in")
  }
  const scans = await db.query.scans.findMany({
    where: (scans, { eq }) => eq(scans.userId, user.id)
  })
  return (
    <main>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business name</TableHead>
            <TableHead>Scan date</TableHead>
            <TableHead>Platforms</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scans.map(scan => (
            <TableRow key={scan.id}>
              <TableCell>{scan.businessName}</TableCell>
              <TableCell>{scan.scanDate.toDateString()}</TableCell>
              <TableCell>
                <Link href={`/scan/results/${scan.id}`}>
                  <Button>View</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
    </main>
  )
}
