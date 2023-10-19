"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";

import { ReportColumn, columns } from "./columns";

type ReportsClientProps = {
  data: ReportColumn[];
}

export function ReportsClient({
  data
}: ReportsClientProps) {
  const router = useRouter()
  const params = useParams() as { orderId: string }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Reports (${data.length})`}
          description="Manage reports and their associated equipment, services and images."
        />
        <Button onClick={() => router.push(`/orders/${params.orderId}/reports/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  )
}
