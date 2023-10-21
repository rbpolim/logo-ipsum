"use client";

import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";

import { UserColumn, columns } from "../_components/columns";

type UsersClientProps = {
  data: UserColumn[]
}

export function UsersClient({
  data
}: UsersClientProps) {
  return (
    <>
      <Heading
        title={`Users (${data.length})`}
        description="Manage users for your store"
      />
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  )
}
