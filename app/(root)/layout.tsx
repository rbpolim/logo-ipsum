import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"

export default async function RootLayout(
  { children }: { children: React.ReactNode }
) {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  if (userId) {
    redirect('/orders')
  }

  return (
    <>
      {children}
    </>
  )
}