import { format } from 'date-fns'

import prisma from '@/lib/prisma'

import { ReportsClient } from "./_components/client"
import { ReportColumn } from './_components/columns'

const ReportsPage = async ({
  params
}: {
  params: { orderId: string }
}) => {
  const reports = await prisma.report.findMany({
    where: {
      orderId: params.orderId
    },
    include: {
      equipment: true,
      schedule: true,
    }
  })

  const formattedReports: ReportColumn[] = reports.map((report) => ({
    number: report.number,
    system: report.equipment?.name || 'N/A',
    date: format(report.schedule?.date!, 'MMMM dd, yyyy'),
    status: report.status,
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ReportsClient data={formattedReports} />
      </div>
    </div>
  )
}

export default ReportsPage