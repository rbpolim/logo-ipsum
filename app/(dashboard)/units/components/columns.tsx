"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type UnitColumn = {
  id: string
  name: string
  company: {
    name: string
  }
  createdAt: string
}

export const columns: ColumnDef<UnitColumn>[] = [
  {
    accessorKey: "name",
    header: "Unit name",
  },
  {
    accessorKey: "company.name",
    header: "Company",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]
