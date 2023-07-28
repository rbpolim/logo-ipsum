"use client"

import { Company, Unit } from '@prisma/client'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'

const formSchema = z.object({
  name: z.string().min(1),
  companyId: z.string().min(1),
})

type UnitFormValues = z.infer<typeof formSchema>

type UnitFormProps = {
  initialData: Unit | null
  companies: Company[]
}

export function UnitForm({
  initialData,
  companies
}: UnitFormProps) {
  const params = useParams();
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const title = initialData ? 'Edit unit' : 'Create unit'
  const description = initialData ? 'Edit an existing unit.' : 'Create a new unit.'
  const action = initialData ? 'Edit unit' : 'Create unit'
  const toastMessage = initialData ? 'Unit edited' : 'Unit created'

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      companyId: '',
    },
  })

  async function onSubmit(data: UnitFormValues) {
    try {
      setLoading(true)
      if (initialData) {
        await axios.put(`/api/units/${params.unitId}`, data)
      } else {
        await axios.post('/api/units', data)
      }

      router.refresh();
      router.push(`/units`);
      toast.success(toastMessage)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
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
            disabled={loading}
            onClick={() => setOpen(true)}
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
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
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
                  <FormLabel>Unit name</FormLabel>
                  <FormControl>
                    <Input placeholder='Unit name' {...field} />
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
