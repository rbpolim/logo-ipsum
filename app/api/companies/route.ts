import { NextResponse } from "next/server"
import { auth } from '@clerk/nextjs'

import prisma from "@/lib/prisma"

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name, unit } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!unit) {
      return new NextResponse('Unit is required', { status: 400 })
    }

    const company = await prisma.company.create({
      data: {
        userId,
        name,
        unit
      }
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error('[COMPANIES_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}