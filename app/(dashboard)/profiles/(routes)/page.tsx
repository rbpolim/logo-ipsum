import prisma from "@/lib/prisma";

import { ProfilesClient } from "../_components/client";
import { ProfileColumn } from "../_components/columns";

const ProfilesPage = async () => {
  const profiles = await prisma.profile.findMany()

  const formattedProfiles: ProfileColumn[] = profiles.map((profile) => ({
    id: profile.id,
    register: profile.register || "N/A",
    name: profile.name,
    email: profile.email,
    role: profile.role,
    position: profile.position || "N/A",
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 p-4 md:p-8 pt-6 space-y-4">
        <ProfilesClient data={formattedProfiles} />
      </div>
    </div>
  )
}

export default ProfilesPage