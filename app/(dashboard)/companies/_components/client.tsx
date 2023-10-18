"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";

import { CompanyColumn, columns } from "./columns";

type CompaniesClientProps = {
  data: CompanyColumn[];
}

export function CompaniesClient({
  data
}: CompaniesClientProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Companies (${data.length})`}
          description="Manage companies and their units."
        />
        <Button onClick={() => router.push(`/companies/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  )
}
