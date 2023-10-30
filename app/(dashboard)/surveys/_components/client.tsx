"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/heading";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { SurveyColumn, columns } from "../_components/columns";

type SurveysClientProps = {
  data: SurveyColumn[]
}

export function SurveysClient({
  data
}: SurveysClientProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Surveys (${data.length})`}
          description="Manage surveys for your system"
        />
        <Button onClick={() => router.push(`/surveys/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="number" columns={columns} data={data} />
    </>
  )
}
