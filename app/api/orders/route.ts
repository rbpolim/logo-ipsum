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
      companyId, 
      requester, 
      location, 
      purpose, 
      startDate, 
      predictedEndDate 
    } = body

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
    
    const order = await prisma.order.create({
      data: {
        companyId,
        requester,
        purpose,
        location,
        userId,
        schedule: {
          create: {
            startDate,
            predictedEndDate,
          }
        }
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('[ORDERS_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}