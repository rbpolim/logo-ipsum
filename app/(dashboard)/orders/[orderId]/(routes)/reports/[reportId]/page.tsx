import prisma from '@/lib/prisma'

import { ReportForm } from './components/report-form'
import { ReportFormTest } from './components/report-form-test'

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
      service: true,
    }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* <ReportForm initialData={report} /> */}
        <ReportFormTest />
      </div>
    </div>
  )
}

export default ReportPage