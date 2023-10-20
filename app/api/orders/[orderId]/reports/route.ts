import { NextResponse } from "next/server"
import { auth } from '@clerk/nextjs'

import prisma from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.orderId) {
      return new NextResponse('Order ID is required', { status: 400 })
    }

    const { schedule, equipment, service, gallery } = body

    if (!schedule.date || !schedule.startTime) {
      return new NextResponse('Schedule is required', { status: 400 })
    }

    if (!equipment.location || !equipment.name || !equipment.model || !equipment.serial || !equipment.tag || !equipment.type || !equipment.description) {
      return new NextResponse('Equipment is required', { status: 400 })
    }
    
    if (!service.diagnostic || !service.recommendation || !service.additionalInfo) {
      return new NextResponse('Service is required', { status: 400 })
    }

    if (!service.procedures.length || !service.procedures.length) {
      return new NextResponse('Service description/procedure is required', { status: 400 })
    }

    const report = await prisma.report.create({
      data: {
        userId,
        orderId: params.orderId,
        schedule: {
          create: { ...schedule }
        },
        equipment: {
          create: { ...equipment }
        },
        service: {
          create: {
            ...service,
            descriptions: {
              createMany: {
                data: service.descriptions.map((item: any) => ({
                  description: item.description,
                })),
              },
            },
            procedures: {
              createMany: {
                data: service.procedures.map((item: any) => ({
                  description: item.description,
                })),
              },
            },
          },
        },
        gallery: {
          createMany: {
            data: gallery.map((item: any) => ({
              comment: item.comment,
              imageUrl: item.imageUrl,
            })),
          }
        }
      }
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error('[REPORTS_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
