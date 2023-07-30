"use client";

import { useRouter, useParams } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";

import { OrderColumn, columns } from "./columns";

type OrdersClientProps = {
  data: OrderColumn[]
}

export function OrdersClient({
  data
}: OrdersClientProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data.length})`}
          description="Manage orders for your store"
        />
        <Button onClick={() => router.push(`/orders/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="number" columns={columns} data={data} />
    </>
  )
}
