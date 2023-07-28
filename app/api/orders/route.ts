import { NextResponse } from "next/server"
import { auth } from '@clerk/nextjs'

import prisma from "@/lib/prisma"

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const {
      companyName,
      companyUnit,
      dateStart,
      requester,
      purpose,
      location,
    } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (
      !companyName ||
      !companyUnit ||
      !dateStart ||
      !requester ||
      !purpose ||
      !location
    ) {
      return new NextResponse('Body parameters are missing', { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        companyName,
        companyUnit,
        dateStart,
        requester,
        purpose,
        location,
        userId,
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.log('[ORDER_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}