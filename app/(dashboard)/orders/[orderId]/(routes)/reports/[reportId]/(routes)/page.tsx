import prisma from '@/lib/prisma'

import { ReportForm } from '../_components/report-form'

const ReportPage = async ({
  params
}: {
  params: { reportId: string }
}) => {
  const report = await prisma.report.findUnique({
    where: {
      id: params.reportId
    },
    include: {
      equipment: true,
      schedule: true,
      service: {
        include: {
          descriptions: true,
          procedures: true
        }
      },
      gallery: true,
    }
  })

  console.log(report)

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ReportForm initialData={report} />
      </div>
    </div>
  )
}

export default ReportPage