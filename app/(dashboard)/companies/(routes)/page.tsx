import { format } from 'date-fns'

import prisma from '@/lib/prisma'

import { CompaniesClient } from "../_components/client"
import { CompanyColumn } from '../_components/columns'

const CompaniesPage = async () => {
  const companies = await prisma.company.findMany()

  const formattedCompanies: CompanyColumn[] = companies.map((company) => ({
    id: company.id,
    name: company.name,
    unit: company.unit,
    createdAt: format(company.createdAt, 'MMMM dd, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 p-4 md:p-8 pt-6 space-y-4">
        <CompaniesClient data={formattedCompanies} />
      </div>
    </div>
  )
}

export default CompaniesPage