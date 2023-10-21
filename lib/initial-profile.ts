import { redirect } from "next/navigation";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import prisma from "@/lib/prisma";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id
    }
  });


  if (!profile) {
    await prisma.profile.create({
      data: {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress
      }
    });
  }

  return redirect("/orders");
};