"use client"

import axios from 'axios'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { Company } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'react-hot-toast'
import { z } from 'zod'

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

const formSchema = z.object({
  name: z.string().trim().min(1),
  unit: z.string().trim().min(1),
})

type CompanyFormValues = z.infer<typeof formSchema>

type CompanyFormProps = {
  initialData: Company | null
}

export function CompanyForm({
  initialData
}: CompanyFormProps) {
  const params = useParams() as { companyId: string }
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit company' : 'Create company'
  const description = initialData ? 'Edit an existing company.' : 'Create a new company.'
  const action = initialData ? 'Edit company' : 'Create company'
  const toastMessage = initialData ? 'Company edited' : 'Company created'

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      unit: '',
    },
  })

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      setLoading(true)

      if (initialData) {
        await axios.put(`/api/companies/${params.companyId}`, data)
      } else {
        await axios.post('/api/companies', data)
      }

      router.refresh();
      router.push(`/companies`);
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
      await axios.delete(`/api/companies/${params.companyId}`);
      router.refresh()
      router.push('/companies');
      toast.success('Company deleted.');
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Company name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company unit</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Company unit' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className='ml-auto' disabled={loading}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
