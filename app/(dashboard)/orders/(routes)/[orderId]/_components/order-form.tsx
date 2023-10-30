"use client"

import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Company, Order, OrderSchedule } from '@prisma/client'
import { CalendarIcon, Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { addDays, format } from 'date-fns'
import axios from 'axios'

import { cn } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/heading'
import { Calendar } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { AlertModal } from '@/components/modals/alert-modal'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { DateRange } from 'react-day-picker'

const formSchema = z.object({
  companyId: z.string().min(1),
  requester: z.string().trim().min(1),
  location: z.string().trim().min(1),
  purpose: z.string().trim().min(1),
})

type OrderFormValues = z.infer<typeof formSchema>

type OrderFormProps = {
  initialData: Order & { schedule: OrderSchedule | null } | null
  companies: Company[]
}

export default function OrderForm({
  initialData,
  companies
}: OrderFormProps) {
  const router = useRouter()
  const params = useParams() as { orderId: string }

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: initialData ? new Date(initialData.schedule!.startDate) : new Date(),
    to: initialData ? new Date(initialData.schedule!.predictedEndDate) : addDays(new Date(), 7)
  })

  const title = initialData ? 'Edit order' : 'Create order'
  const description = initialData ? 'Edit an existing order.' : 'Create a new order.'
  const action = initialData ? 'Edit order' : 'Create order'
  const toastMessage = initialData ? 'Order edited' : 'Order created'

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      companyId: '',
      requester: '',
      location: '',
      purpose: '',
    },
  })

  const onSubmit = async (data: OrderFormValues) => {
    try {
      setLoading(true)

      const startDate = date?.from
      const predictedEndDate = date?.to

      const dataFormatted = {
        ...data,
        startDate,
        predictedEndDate
      }

      if (initialData) {
        await axios.put(`/api/orders/${params.orderId}`, dataFormatted)
      } else {
        await axios.post('/api/orders', dataFormatted)
      }

      router.refresh();
      router.push(`/orders`);
      toast.success(toastMessage)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const onCancel = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/orders/${params.orderId}`)
      router.refresh()
      router.push('/orders')
      toast.success('Order cancelled')
    } catch (error: any) {
      toast.error('Make sure you removed all orders using this company first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onCancel}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description}
        />
        {initialData && (
          <Button
            size="sm"
            disabled={loading}
            onClick={() => setOpen(true)}
            variant="destructive"
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-8'
        >
          <div className='grid gap-8 md:grid-cols-3'>
            <FormItem>
              <FormLabel>
                Select a start and end date
              </FormLabel>
              <div className={cn("grid gap-2")}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      disabled={loading}
                      className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData ? initialData.companyId : undefined}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requester</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Requester name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Location name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Purpose of the order' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          <Button
            disabled={loading}
            type="button"
            variant="outline"
            className='ml-auto mr-4'
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" className='ml-auto' disabled={loading}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
