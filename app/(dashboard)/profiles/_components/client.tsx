"use client";

import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";

import { ProfileColumn, columns } from "../_components/columns";

type ProfilesClientProps = {
  data: ProfileColumn[]
}

export function ProfilesClient({
  data
}: ProfilesClientProps) {
  return (
    <>
      <Heading
        title={`Profiles (${data.length})`}
        description="Manage profiles for your store"
      />
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  )
}
