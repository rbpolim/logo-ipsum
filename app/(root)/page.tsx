import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";

const RootPage = async () => {
  await initialProfile();

  return null
}

export default RootPage