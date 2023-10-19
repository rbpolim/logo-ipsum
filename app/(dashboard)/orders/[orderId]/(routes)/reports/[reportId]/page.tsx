import prisma from '@/lib/prisma'

import { ReportForm } from './_components/report-form'
// import { ReportFormTest } from './_components/report-form-test'

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
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ReportForm initialData={report} />
        {/* <ReportFormTest /> */}
      </div>
    </div>
  )
}

export default ReportPage