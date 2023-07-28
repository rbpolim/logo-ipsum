import { auth } from "@clerk/nextjs"
import { redirect } from 'next/navigation'

import { Header } from "@/components/header"

export default async function DashboardLayout(
  { children }: { children: React.ReactNode }
) {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <>
      <Header />
      {children}
    </>
  )
}