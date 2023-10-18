import { format } from 'date-fns'

import prisma from '@/lib/prisma'

import { ReportsClient } from "./components/client"
import { ReportColumn } from './components/columns'

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
    }
  })

  const formattedReports: ReportColumn[] = reports.map((report) => ({
    id: report.id,
    name: report.equipment?.name || 'N/A',
    createdAt: format(report.createdAt, 'MMMM dd, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ReportsClient data={formattedReports} />
      </div>
    </div>
  )
}

export default ReportsPage