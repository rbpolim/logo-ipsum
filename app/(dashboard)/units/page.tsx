import { format } from 'date-fns'

import prisma from '@/lib/prisma'

import { UnitsClient } from "./components/client"
import { UnitColumn } from './components/columns'

const UnitsPage = async () => {
  const units = await prisma.unit.findMany({
    include: {
      company: true
    }
  })

  const formattedUnits: UnitColumn[] = units.map((unit) => ({
    id: unit.id,
    name: unit.name,
    company: {
      name: unit.company.name
    },
    createdAt: format(unit.createdAt, 'MMMM dd, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UnitsClient data={formattedUnits} />
      </div>
    </div>
  )
}

export default UnitsPage