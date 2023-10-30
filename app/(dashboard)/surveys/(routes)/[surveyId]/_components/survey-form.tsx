"use client"

import axios from 'axios'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { Order, Survey } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'react-hot-toast'
import { z } from 'zod'

import { addYearPrefixToId } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import { AlertModal } from '@/components/modals/alert-modal'
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

const formSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().email().optional(),
  role: z.string().trim().min(1),
  orderId: z.string().trim().min(1),
})

type SurveyFormValues = z.infer<typeof formSchema>

type SurveyFormProps = {
  initialData: Survey | null
  orders: Order[]
}

export function SurveyForm({
  initialData,
  orders
}: SurveyFormProps) {
  const params = useParams() as { profileId: string }
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit survey' : 'Create survey'
  const description = initialData ? 'Edit an existing survey.' : 'Create a new survey.'
  const action = initialData ? 'Edit survey' : 'Create survey'
  const toastMessage = initialData ? 'Survey edited' : 'Survey created'

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      role: '',
      orderId: '',
    },
  })

  const onSubmit = async (data: SurveyFormValues) => {
    try {
      setLoading(true)
      console.log(data)

      // await axios.put(`/api/profiles/${params.profileId}`, data)

      router.refresh();
      router.push(`/surveys`);
      toast.success(toastMessage)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)

      // await axios.delete(`/api/profiles/${params.profileId}`);

      router.refresh()
      router.push('/surveys');
      toast.success('Survey deleted');
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
        onConfirm={onDelete}
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
            <FormField
              control={form.control}
              name="orderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData ? initialData.orderId : undefined}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a order" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {orders.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          {addYearPrefixToId(order.number)}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participant name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participant email</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participant role</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Role' {...field} />
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
