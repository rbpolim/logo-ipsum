import prisma from '@/lib/prisma'
import { format } from 'date-fns'

import { CompaniesClient } from "./components/client"
import { CompanyColumn } from './components/columns'

const CompaniesPage = async () => {
  const companies = await prisma.company.findMany()

  const formattedCompanies: CompanyColumn[] = companies.map((company) => ({
    id: company.id,
    name: company.name,
    cnpj: company.cnpj,
    createdAt: format(company.createdAt, 'MMMM dd, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CompaniesClient data={formattedCompanies} />
      </div>
    </div>
  )
}

export default CompaniesPage