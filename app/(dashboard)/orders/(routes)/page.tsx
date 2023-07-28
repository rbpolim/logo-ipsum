import prisma from "@/lib/prisma"

import { OrderClient } from "../components/client"

export default async function OrdersPage() {
  const orders = await prisma.order.findMany()

  console.log(orders)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient />
      </div>
    </div>
  )
}
