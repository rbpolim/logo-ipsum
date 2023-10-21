import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()

    await prisma.profile.update({
      where: {
        userId: params.userId
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