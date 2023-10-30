"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "../_components/cell-action"

export type SurveyColumn = {
  id: string
  orderId: string
  createdAt: string
}

export const columns: ColumnDef<SurveyColumn>[] = [
  {
    accessorKey: "id",
    header: "Survey ID",
  },
  {
    accessorKey: "orderId",
    header: "Order ID",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]
