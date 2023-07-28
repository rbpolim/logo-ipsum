"use client"

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "./dialog"

type ModalProps = {
  title: string
  description: string
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
}

export function Modal({
  title,
  description,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  function onChange(open: boolean) {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}