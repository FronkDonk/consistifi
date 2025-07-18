import { Table, TableBody, TableRow } from "@/components/ui/table"
import { db } from "@/db/drizzle"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashBoardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const user = session?.user

  if (!user) {
    redirect("/sign-in")
  }
  db.query.scans.findMany({
    where: (scans, { eq }) => eq(scans.userId, user.id)
  })
  return (
    <main>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>

            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  )
}
