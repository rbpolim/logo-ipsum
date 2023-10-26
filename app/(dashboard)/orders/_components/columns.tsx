"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"

import { CellAction } from "../_components/cell-action"

export type OrderColumn = {
  id: string
  number: number
  company: string
  unit: string
  status: string
  startDate: string
  predictedEndDate: string
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
    header: "Date start",
  },
  {
    accessorKey: "predictedEndDate",
    header: "Date predict end",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]
