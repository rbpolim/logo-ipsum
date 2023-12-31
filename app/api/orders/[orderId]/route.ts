import { NextResponse } from "next/server"
import { auth } from '@clerk/nextjs'

import prisma from "@/lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = auth()

    const body = await req.json()

    const { 
      companyId, 
      requester, 
      location, 
      purpose, 
      startDate, 
      predictedEndDate 
    } = body

    if (!params.orderId) {
      return new NextResponse('Order ID is required', { status: 400 })
    }

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!companyId) {
      return new NextResponse('Company ID is required', { status: 400 })
    }

    if (!requester) {
      return new NextResponse('Requester is required', { status: 400 })
    }

    if (!location) {
      return new NextResponse('Location is required', { status: 400 })
    }

    if (!purpose) {
      return new NextResponse('Purpose is required', { status: 400 })
    }

    if (!startDate && !predictedEndDate) {
      return new NextResponse('Range date is required', { status: 400 })
    }

    const order = await prisma.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        companyId,
        requester,
        location,
        purpose,
        userId,
        schedule: {
          update: {
            startDate,
            predictedEndDate,
          }
        }
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('[ORDER_PUT]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.orderId) {
      return new NextResponse('Order ID is required', { status: 400 })
    }

    await prisma.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        status: 'CANCELED'
      }
    })

    return NextResponse.json({ message: 'Order cancelled' })
  } catch (error) {
    console.error('[ORDER_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}