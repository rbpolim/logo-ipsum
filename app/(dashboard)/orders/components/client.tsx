"use client";

import { useRouter, useParams } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";

export function OrderClient() {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${0})`}
          description="Manage orders for your store"
        />
        <Button onClick={() => router.push(`/orders/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      {/* <DataTable searchKey="label" columns={columns} data={data} /> */}
    </>
  )
}
