"use client"

import { useRouter } from "next/navigation"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"

import { CompanyColumn } from "./columns"

import { AlertModal } from "@/components/modals/alert-modal"
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"

type CellActionProps = {
  data: CompanyColumn
}

export const CellAction = ({
  data
}: CellActionProps) => {
  const router = useRouter()

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/companies/${data.id}`)
      toast.success('Company deleted.')
      router.refresh()
    } catch (error) {
      toast.error('Make sure you removed all orders using this company first.')
    } finally {
      setOpen(false)
      setLoading(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`/companies/${data.id}`)}>
            <Edit className="mr-2 w-4 h-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 w-4 h-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}