"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge"

export type OrderColumn = {
  id: string
  number: number
  company: string
  unit: string
  status: string
  startDate: string
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "number",
    header: "Order",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "unit",
    header: "Unit",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.original.status}</Badge>
  },
  {
    accessorKey: "startDate",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]
