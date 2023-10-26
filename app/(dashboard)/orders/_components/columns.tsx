"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"

import { CellAction } from "../_components/cell-action"

export type OrderColumn = {
  id: string
  number: string
  company: string
  unit: string
  status: string
  startDate: string
}

const badgeVariants = {
  variant: {
    default: 'default',
    secondary: 'secondary',
    success: 'success',
    destructive: 'destructive',
    outline: 'outline',
  },
};

type BadgeVariantType = keyof typeof badgeVariants.variant;

const mappingStatus: Record<string, { label: string, variant: BadgeVariantType }> = {
  "IN_PROGRESS": {
    label: "In progress",
    variant: 'default'
  },
  "WAITING_APPROVAL_POLL": {
    label: "Completed",
    variant: "success"
  },
  "FINISHED": {
    label: "Cancelled",
    variant: "destructive"
  },
  "CANCELED": {
    label: "Pending",
    variant: "secondary"
  },
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
    cell: ({ row }) => (
      <Badge variant={mappingStatus[row.original.status].variant}>
        {mappingStatus[row.original.status].label}
      </Badge>
    )
  },
  {
    accessorKey: "startDate",
    header: "Date start",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]
