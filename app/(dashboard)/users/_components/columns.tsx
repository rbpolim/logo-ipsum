"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"

import { CellAction } from "../_components/cell-action"

export type UserColumn = {
  id: string
  register: string
  name: string
  email: string
  role: string
}

export const columns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: "register",
    header: "Register",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <Badge>{row.original.role}</Badge>
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]
