import prisma from "@/lib/prisma"

import OrderForm from "./components/order-form"

const OrderPage = async ({
  params
}: {
  params: { orderId: string }
}) => {
  const order = await prisma.order.findUnique({
    where: {
      id: params.orderId
    },
  })

  const companies = await prisma.company.findMany()

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderForm initialData={order} companies={companies} />
      </div>
    </div>
  )
}

export default OrderPage
