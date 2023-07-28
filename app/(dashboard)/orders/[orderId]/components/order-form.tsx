"use client"

import { Order } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { ChevronLeftCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { toast } from 'react-hot-toast'

const formSchema = z.object({
  companyName: z.string().min(1),
  companyUnit: z.string().min(1),
  dateStart: z.string().min(1),
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
      dateStart: '',
      requester: '',
      location: '',
      purpose: '',
    },
  })

  async function onSubmit(data: OrderFormValues) {
    console.log(data)
    toast.success(toastMessage)
  }

  return (
    <>
      <div className="flex items-center gap-8">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => router.back()}
        >
          <ChevronLeftCircle className="h-10 w-10" />
        </Button>
        <Heading
          title={title}
          description={description}
        />
      </div>
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
          </div>

          <Button type="submit" className='ml-auto'>
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
