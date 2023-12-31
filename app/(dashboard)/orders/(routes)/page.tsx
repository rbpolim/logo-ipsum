import { format } from "date-fns"

import prisma from "@/lib/prisma"

import { addYearPrefixToId } from "@/lib/utils"

import { OrdersClient } from "../_components/client"
import { OrderColumn } from "../_components/columns"

const OrdersPage = async () => {
  const orders = await prisma.order.findMany({
    include: {
      company: true,
      schedule: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    number: addYearPrefixToId(order.number),
    company: order.company.name,
    unit: order.company.unit,
    status: order.status,
    startDate: format(order.schedule!.startDate, 'MMMM dd, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 p-4 md:p-8 pt-6 space-y-4">
        <OrdersClient data={formattedOrders} />
      </div>
    </div>
  )
}

export default OrdersPage
