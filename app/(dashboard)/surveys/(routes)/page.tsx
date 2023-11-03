import { format } from "date-fns"

import prisma from "@/lib/prisma"

import { SurveysClient } from "../_components/client"
import { SurveyColumn } from "../_components/columns"

const SurveysPage = async () => {
  const surveys = await prisma.survey.findMany()

  const formattedSurveys: SurveyColumn[] = surveys.map((survey) => ({
    id: survey.id,
    orderId: survey.orderId,
    createdAt: format(survey.createdAt, 'MMMM dd, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 p-4 md:p-8 pt-6 space-y-4">
        <SurveysClient data={formattedSurveys} />
      </div>
    </div>
  )
}

export default SurveysPage

