import prisma from '@/lib/prisma'

import { SurveyForm } from './_components/survey-form'

const SurveyPage = async ({
  params
}: {
  params: { surveyId: string }
}) => {
  const orders = await prisma.order.findMany()

  const survey = await prisma.survey.findUnique({
    where: {
      id: params.surveyId
    },
    include: {
      participants: true
    }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SurveyForm initialData={survey} orders={orders} />
      </div>
    </div>
  )
}

export default SurveyPage