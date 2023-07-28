import { NextResponse } from "next/server"
import { auth } from '@clerk/nextjs'

import prisma from "@/lib/prisma"

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name, cnpj } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!cnpj) {
      return new NextResponse('CNPJ is required', { status: 400 })
    }

    const company = await prisma.company.create({
      data: {
        name,
        cnpj,
      }
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error('[COMPANIES_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}