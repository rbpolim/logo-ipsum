import { NextResponse } from "next/server"
import { auth } from '@clerk/nextjs'

import prisma from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { unitId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.unitId) {
      return new NextResponse('Unit ID is required', { status: 400 })
    }

    const unit = await prisma.unit.findUnique({
      where: {
        id: params.unitId,
      },
    })

    return NextResponse.json(unit)
  } catch (error) {
    console.error('[UNIT_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { unitId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name, companyId } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!companyId) {
      return new NextResponse('Company ID is required', { status: 400 })
    }

    const unit = await prisma.unit.update({
      where: {
        id: params.unitId,
      },
      data: {
        name,
        companyId,
      }
    })

    return NextResponse.json(unit)
  } catch (error) {
    console.error('[UNIT_UPDATE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  { params }: { params: { unitId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.unitId) {
      return new NextResponse('Unit ID is required', { status: 400 })
    }

    await prisma.unit.delete({
      where: {
        id: params.unitId,
      },
    })

    return NextResponse.json({ message: 'Unit deleted' })
  } catch (error) {
    console.error('[UNIT_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}