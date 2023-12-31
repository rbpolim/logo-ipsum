import prisma from '@/lib/prisma'

import { CompanyForm } from './_components/company-form'

const CompanyPage = async ({
  params
}: {
  params: { companyId: string }
}) => {
  const company = await prisma.company.findUnique({
    where: {
      id: params.companyId
    }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 p-4 md:p-8 pt-6 space-y-4">
        <CompanyForm initialData={company} />
      </div>
    </div>
  )
}

export default CompanyPage