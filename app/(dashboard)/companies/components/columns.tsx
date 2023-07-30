"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type CompanyColumn = {
  id: string
  name: string
  cnpj: string
  unit: string
  createdAt: string
}

export const columns: ColumnDef<CompanyColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "cnpj",
    header: "CNPJ",
  },
  {
    accessorKey: "unit",
    header: "Unit",
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
