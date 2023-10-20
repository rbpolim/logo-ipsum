import prisma from '@/lib/prisma'

import { UserForm } from './_components/user-form'

const UserPage = async ({
  params
}: {
  params: { userId: string }
}) => {
  const user = await prisma.profile.findUnique({
    where: {
      id: params.userId
    }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <UserForm initialData={user} />
      </div>
    </div>
  )
}

export default UserPage