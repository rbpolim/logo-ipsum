import { NextResponse } from "next/server"
import { auth } from '@clerk/nextjs'

import prisma from "@/lib/prisma"

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth()

    const body = await req.json()

    const { companyId, requester, location, purpose, dateStart } = body

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

    if (!dateStart) {
      return new NextResponse('Date start is required', { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        companyId,
        requester,
        location,
        purpose,
        dateStart,
        userId
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('[ORDERS_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}