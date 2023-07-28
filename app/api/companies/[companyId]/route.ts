import { NextResponse } from "next/server"
import { auth } from '@clerk/nextjs'

import prisma from "@/lib/prisma"

export async function GET(
  { params }: { params: { companyId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.companyId) {
      return new NextResponse('Company ID is required', { status: 400 })
    }

    const company = await prisma.company.findUnique({
      where: {
        id: params.companyId,
      },
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error('[COMPANY_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { companyId: string } }
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

    if (!params.companyId) {
      return new NextResponse('Company ID is required', { status: 400 })
    }

    const company = await prisma.company.update({
      where: {
        id: params.companyId,
      },
      data: {
        name,
        cnpj,
      }
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error('[COMPANY_PUT]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  { params }: { params: { companyId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.companyId) {
      return new NextResponse('Company ID is required', { status: 400 })
    }

    await prisma.company.delete({
      where: {
        id: params.companyId,
      },
    })

    return NextResponse.json({ message: 'Company deleted' })
  } catch (error) {
    console.error('[COMPANY_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}