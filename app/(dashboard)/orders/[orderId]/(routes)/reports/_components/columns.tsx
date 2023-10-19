"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"

import { CellAction } from "../_components/cell-action"

export type ReportColumn = {
  number: number
  system: string
  date: string
  status: string
}

export const columns: ColumnDef<ReportColumn>[] = [
  {
    accessorKey: "number",
    header: "Number",
  },
  {
    accessorKey: "system",
    header: "System",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.original.status}</Badge>
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]
