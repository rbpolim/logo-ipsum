import { format } from "date-fns"

import prisma from "@/lib/prisma"

import { OrdersClient } from "../_components/client"
import { OrderColumn } from "../_components/columns"

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      company: true,
      schedule: true,
    }
  })

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    number: order.number,
    company: order.company.name,
    unit: order.company.unit,
    status: order.status,
    startDate: format(order.schedule!.startDate, 'MMMM dd, yyyy'),
    predictedEndDate: format(order.schedule!.predictedEndDate, 'MMMM dd, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <OrdersClient data={formattedOrders} />
      </div>
    </div>
  )
}
