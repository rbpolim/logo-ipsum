import prisma from '@/lib/prisma'

import { UnitForm } from './components/unit-form'

const UnitPage = async ({
  params
}: {
  params: { unitId: string }
}) => {
  const unit = await prisma.unit.findUnique({
    where: {
      id: params.unitId
    }
  })

  const companies = await prisma.company.findMany()

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UnitForm initialData={unit} companies={companies} />
      </div>
    </div>
  )
}

export default UnitPage