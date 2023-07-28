"use client"

import { Company } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { toast } from 'react-hot-toast'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import axios from 'axios'
import { Trash } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(1),
  cnpj: z.string().min(1),
})

type CompanyFormValues = z.infer<typeof formSchema>

type CompanyFormProps = {
  initialData: Company | null
}

export function CompanyForm({
  initialData
}: CompanyFormProps) {
  const params = useParams();
  const router = useRouter()

  const title = initialData ? 'Edit company' : 'Create company'
  const description = initialData ? 'Edit an existing company.' : 'Create a new company.'
  const action = initialData ? 'Edit company' : 'Create company'
  const toastMessage = initialData ? 'Company edited' : 'Company created'

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      cnpj: '',
    },
  })

  async function onSubmit(data: CompanyFormValues) {
    try {
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
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">

        <Heading
          title={title}
          description={description}
        />
        {initialData && (
          <Button
            // disabled={loading}
            // onClick={() => setOpen(true)}
            variant="destructive"
            size="sm"
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
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
              name="name"
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
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company CNPJ</FormLabel>
                  <FormControl>
                    <Input placeholder='Company CNPJ' {...field} />
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
