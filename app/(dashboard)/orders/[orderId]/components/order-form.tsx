"use client"

import { Order } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/heading'
import { Calendar } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
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
import axios from 'axios'

const formSchema = z.object({
  companyName: z.string().min(1),
  companyUnit: z.string().min(1),
  dateStart: z.date(),
  requester: z.string().min(1),
  location: z.string().min(1),
  purpose: z.string().min(1),
})

type OrderFormValues = z.infer<typeof formSchema>

type OrderFormProps = {
  initialData: Order | null
}

export default function OrderForm({
  initialData
}: OrderFormProps) {
  const params = useParams();
  const router = useRouter()

  const title = initialData ? 'Edit Order' : 'Create Order'
  const description = initialData ? 'Edit an existing order.' : 'Create a new order.'
  const action = initialData ? 'Edit order' : 'Create order'
  const toastMessage = initialData ? 'Order edited' : 'Order created'

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      companyName: '',
      companyUnit: '',
      dateStart: new Date(),
      requester: '',
      location: '',
      purpose: '',
    },
  })

  async function onSubmit(data: OrderFormValues) {
    try {
      if (initialData) {
        await axios.put(`/api/orders/${params.orderId}`, data)
      } else {
        await axios.post('/api/orders', data)
      }

      router.refresh();
      router.push(`/orders`);
      toast.success(toastMessage)
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <>
      <Heading
        title={title}
        description={description}
      />
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <div className='md:grid md:grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input placeholder='Company name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company unit</FormLabel>
                  <FormControl>
                    <Input placeholder='Company unit' {...field} />
                  </FormControl>
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
                    <Input placeholder='Requester name' {...field} />
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
                    <Input placeholder='Location name' {...field} />
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
                    <Input placeholder='Purpose of the order' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateStart"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onDayClick={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className='ml-auto'>
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
