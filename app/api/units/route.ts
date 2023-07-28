import { NextResponse } from "next/server"
import { auth } from '@clerk/nextjs'

import prisma from "@/lib/prisma"

export async function GET(
  req: Request,
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const units = await prisma.unit.findMany()

    return NextResponse.json(units)
  } catch (error) {
    console.error('[UNITS_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth()

    const body = await req.json()

    const { name, companyId } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!companyId) {
      return new NextResponse('Company ID is required', { status: 400 })
    }

    const unit = await prisma.unit.create({
      data: {
        name,
        companyId,
      }
    })

    return NextResponse.json(unit)
  } catch (error) {
    console.error('[UNITS_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}