"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";

import { UnitColumn, columns } from "./columns";
import { DataTable } from "@/components/data-table";

type UnitsClientProps = {
  data: UnitColumn[];
}

export function UnitsClient({
  data
}: UnitsClientProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Units (${data.length})`}
          description="Manage units and their companies."
        />
        <Button onClick={() => router.push(`/units/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  )
}
