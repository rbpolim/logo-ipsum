import prisma from '@/lib/prisma'

import { ProfileForm } from './_components/profile-form'

const ProfilePage = async ({
  params
}: {
  params: { profileId: string }
}) => {
  const profile = await prisma.profile.findUnique({
    where: {
      id: params.profileId
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ProfileForm initialData={profile} />
      </div>
    </div>
  )
}

export default ProfilePage