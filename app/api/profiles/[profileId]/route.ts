import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()

    const { name, email, role  } = body

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!email) {
      return new NextResponse('Email is required', { status: 400 })
    }

    if (!role) {
      return new NextResponse('Role is required', { status: 400 })
    }

    await prisma.profile.update({
      where: {
        id: params.profileId
      },
      data: {
        ...body
      }
    })

    return NextResponse.json({ message: 'Profile updated' })
  } catch (error) {
    console.error('[USER_PUT]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}