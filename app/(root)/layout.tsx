import { redirect } from "next/navigation"

import { initialProfile } from "@/lib/initial-profile"

export default async function RootLayout(
  { children }: { children: React.ReactNode }
) {
  const profile = await initialProfile()

  if (profile) {
    redirect('/orders')
  }

  return (
    <>
      {children}
    </>
  )
}