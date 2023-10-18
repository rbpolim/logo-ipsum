"use client"

import axios from 'axios'
import { CalendarIcon, Trash } from 'lucide-react'
import { useState } from 'react'
import { Equipment, Report, Service } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'react-hot-toast'
import { z } from 'zod'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import { AlertModal } from '@/components/modals/alert-modal'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import ImageUpload from '@/components/image-upload'

const formSchema = z.object({
  date: z.date(),
  hourStart: z.string().min(1),
  equipment: z.object({
    name: z.string().min(1),
    location: z.string().min(1),
    type: z.string().min(1),
    description: z.string().min(1),
    model: z.string().min(1),
    serial: z.string().min(1),
    tag: z.string().min(1),
  }),
  service: z.object({
    diagnostic: z.string().min(1),
    description: z.string().min(1),
    procedure: z.string().min(1),
    recommendation: z.string().min(1),
    additionalInfo: z.string().min(1),
  }),
  gallery: z.object({
    imageUrl: z.string().min(1),
    comment: z.string().min(1),
  }).array(),
})

type ReportFormValues = z.infer<typeof formSchema>

type ReportFormProps = {
  initialData: Report & {
    equipment: Equipment
    service: Service
  } | null
}

export function ReportForm({
  initialData
}: ReportFormProps) {
  const params = useParams() as { reportId: string }
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit report' : 'Create report'
  const description = initialData ? 'Edit an existing report.' : 'Create a new report.'
  const action = initialData ? 'Edit report' : 'Create report'
  const toastMessage = initialData ? 'Report edited' : 'Report created'

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      date: undefined,
      hourStart: '',
      equipment: {
        name: '',
        location: '',
        description: '',
        type: '',
        model: '',
        serial: '',
        tag: '',
      },
      service: {
        diagnostic: '',
        description: '',
        procedure: '',
        recommendation: '',
        additionalInfo: '',
      },
      gallery: [{ imageUrl: '', comment: '' }]
    },
  })

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'gallery',
  })

  const onSubmit = async (data: ReportFormValues) => {
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
          <div className='grid md:grid-cols-5 gap-8'>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger disabled={loading} asChild>
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
                        initialFocus
                        mode="single"
                        selected={field.value}
                        onDayClick={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hourStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hour start</FormLabel>
                  <FormControl>
                    <Input type="time" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className='grid md:grid-cols-4 gap-8'>
            <FormField
              control={form.control}
              name="equipment.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment system</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Equipment name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equipment.location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment location</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Equipment location' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equipment.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment type</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Equipment type' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equipment.model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment model</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Equipment model' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equipment.serial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment serial</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Equipment serial' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equipment.tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment tag</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Equipment tag' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equipment.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment description</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Equipment description' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className='grid md:grid-cols-2 gap-8'>
            <FormField
              control={form.control}
              name="service.diagnostic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service diagnostic</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service.procedure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service procedure</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service.recommendation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service recommendation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service.additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service additional information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Separator />
          {fieldArray.fields.map((field, index) => (
            <div key={field.id} className='grid md:grid-cols-6 gap-8'>
              <FormField
                control={form.control}
                name={`gallery.${index}.imageUrl`}
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value ? [field.value] : []}
                        disabled={loading}
                        onChange={(url) => field.onChange(url)}
                        onRemove={() => field.onChange('')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`gallery.${index}.comment`}
                render={({ field }) => (
                  <FormItem className='col-span-4'>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Input placeholder='Comment for the image' disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <Button type="submit" className='ml-auto' disabled={loading}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
