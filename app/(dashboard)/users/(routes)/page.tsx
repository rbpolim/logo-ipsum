import prisma from "@/lib/prisma";

import { UsersClient } from "../_components/client";
import { UserColumn } from "../_components/columns";

const UsersPage = async () => {
  const profiles = await prisma.profile.findMany()

  const formattedUsers: UserColumn[] = profiles.map((profile) => ({
    id: profile.id,
    register: profile.register || "N/A",
    name: profile.name,
    email: profile.email,
    role: profile.role,
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <UsersClient data={formattedUsers} />
      </div>
    </div>
  )
}

export default UsersPage