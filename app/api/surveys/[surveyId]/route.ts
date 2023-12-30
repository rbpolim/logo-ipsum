import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: { surveyId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()

    const { orderId, participants } = body

    if (!orderId) {
      return new NextResponse('OrderId required', { status: 400 })
    }
    
    if (!participants || !participants.length) {
      return new NextResponse('Participants required', { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId
      }, 
      include: {
        survey: true
      }
    })

    if (!order) {
      return new NextResponse('Order not found', { status: 404 })
    }

    const participantAlreadyAnswered = await prisma.surveyParticipant.deleteMany({
      where: {
        AND: [
          { surveyId: params.surveyId },
          { answeredAt: null },
        ]
      }
    })

    if (participantAlreadyAnswered) {
      return new NextResponse('Participant already answered', { status: 400 })
    }

    const survey = await prisma.survey.update({
      where: {
        id: params.surveyId
      },
      data: {
        orderId,
        userId,
        participants: {
          createMany: {
            data: participants.map((participant: any) => ({
              name: participant.name,
              email: participant.email,
              role: participant.role,
            }))
          }
        }
      }
    })
 
    return NextResponse.json(survey)
  } catch (error) {
    console.error('[SURVEY_PUT]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}