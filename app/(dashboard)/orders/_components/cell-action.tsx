"use client"

import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Edit, File, MoreHorizontal, Trash } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { AlertModal } from "@/components/modals/alert-modal"

import { OrderColumn } from "./columns"

type CellActionProps = {
  data: OrderColumn
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

      await axios.delete(`/api/orders/${data.id}`)

      toast.success('Order cancelled.')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong, please try again later')
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
          <Button variant="ghost" className="w-8 h-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`/orders/${data.id}/reports`)}>
            <File className="w-4 h-4 mr-2" />
            Reports
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/orders/${data.id}`)}>
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}