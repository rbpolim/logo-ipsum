"use client"

import axios from 'axios'
import { CalendarIcon, Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import { Report } from '@prisma/client'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import ImageUpload from '@/components/image-upload'

const formSchema = z.object({
  schedule: z.object({
    date: z.date(),
    startTime: z.string().trim().min(1),
  }),
  equipment: z.object({
    name: z.string().trim().min(1),
    location: z.string().trim().min(1),
    type: z.string().trim().min(1),
    description: z.string().trim().min(1),
    model: z.string().trim().min(1),
    serial: z.string().trim().min(1),
    tag: z.string().trim().min(1),
  }),
  service: z.object({
    diagnostic: z.string().trim().min(1),
    recommendation: z.string().trim().min(1),
    additionalInfo: z.string().trim().min(1),
  }),
  descriptions: z.object({
    description: z.string().trim().min(1),
  }).array(),
  procedures: z.object({
    description: z.string().trim().min(1),
  }).array(),
  gallery: z.object({
    imageUrl: z.string().min(1),
    comment: z.string().trim().min(1),
  }).array().optional(),
})

type ReportFormValues = z.infer<typeof formSchema>

type ReportFormProps = {
  initialData: Report | null
}

export function ReportForm({
  initialData
}: ReportFormProps) {
  const params = useParams() as { reportId: string, orderId: string }
  const router = useRouter()

  console.log(initialData)

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit report' : 'Create report'
  const description = initialData ? 'Edit an existing report.' : 'Create a new report.'
  const action = initialData ? 'Edit report' : 'Create report'
  const toastMessage = initialData ? 'Report edited' : 'Report created'

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(formSchema),
    // @ts-ignore TODO: fix this
    defaultValues: initialData || {
      schedule: {
        date: undefined,
        startTime: '',
      },
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
        recommendation: '',
        additionalInfo: '',
      },
      descriptions: [{ description: '' }],
      procedures: [{ description: '' }],
      gallery: []
    },
  })

  const galleryFieldArray = useFieldArray({
    control: form.control,
    name: 'gallery',
  })

  const descriptionFieldArray = useFieldArray({
    control: form.control,
    name: 'descriptions',
  })

  const procedureFieldArray = useFieldArray({
    control: form.control,
    name: 'procedures',
  })

  const onSubmit = async (data: ReportFormValues) => {
    try {
      setLoading(true)

      if (initialData) {
        await axios.put(`/api/orders/${params.orderId}/reports/${params.reportId}`, data)
      } else {
        await axios.post(`/api/orders/${params.orderId}/reports`, data)
      }

      router.refresh();
      router.push(`/orders/${params.orderId}/reports`);
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

      await axios.delete(`/api/order/${params.orderId}/reports/${params.reportId}`);

      router.refresh()
      router.push(`/orders/${params.orderId}/reports`);
      toast.success('Company deleted');
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
          <div className='grid gap-8 md:grid-cols-5'>
            <FormField
              control={form.control}
              name="schedule.date"
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
                          <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="single"
                        selected={field.value}
                        onDayClick={field.onChange}
                        disabled={(date) => date < new Date("2023-01-01")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="schedule.startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hour time</FormLabel>
                  <FormControl>
                    <Input type="time" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className='grid gap-8 md:grid-cols-4'>
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
          <div className='grid gap-8 md:grid-cols-2'>
            <div className='col-start-1'>
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Service description</FormLabel>
                  <FormDescription>You can add multiple descriptions for this service.</FormDescription>
                </div>
                <Button
                  size="sm"
                  type='button'
                  variant="ghost"
                  onClick={() => descriptionFieldArray.append({ description: '' })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add description
                </Button>
              </FormItem>
              {descriptionFieldArray.fields.map((field, index) => (
                <div key={field.id} className='my-2'>
                  <FormField
                    control={form.control}
                    name={`descriptions.${index}.description`}
                    render={({ field }) => (
                      <div className='flex flex-col w-full'>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder='Service description'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <Button
                          size="sm"
                          type='button'
                          variant="destructive"
                          className='mt-1 ml-auto'
                          disabled={loading || descriptionFieldArray.fields.length === 1}
                          onClick={() => descriptionFieldArray.remove(index)}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Remove description
                        </Button>
                      </div>
                    )}
                  />
                </div>
              ))}
            </div>
            <div className='col-start-2'>
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Service procedures</FormLabel>
                  <FormDescription>
                    You can add multiple procedures for this service.
                  </FormDescription>
                </div>
                <Button
                  size="sm"
                  type='button'
                  variant="ghost"
                  onClick={() => procedureFieldArray.append({ description: '' })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add procedure
                </Button>
              </FormItem>
              {procedureFieldArray.fields.map((field, index) => (
                <div key={field.id} className='my-2'>
                  <FormField
                    control={form.control}
                    name={`procedures.${index}.description`}
                    render={({ field }) => (
                      <div className='flex flex-col w-full'>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder='Service procedure'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <Button
                          size="sm"
                          type='button'
                          variant="destructive"
                          className='mt-1 ml-auto'
                          disabled={loading || procedureFieldArray.fields.length === 1}
                          onClick={() => procedureFieldArray.remove(index)}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Remove procedure
                        </Button>
                      </div>
                    )}
                  />
                </div>
              ))}
            </div>
            <FormField
              control={form.control}
              name="service.diagnostic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service diagnostic</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Service diagnostic"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <section className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <FormLabel>Gallery</FormLabel>
                <FormDescription>You can add multiple images and comments</FormDescription>
              </div>
              <Button
                type="button"
                onClick={() => galleryFieldArray.append({ imageUrl: '', comment: '' })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add image
              </Button>
            </div>
            <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
              {galleryFieldArray.fields.map((field, index) => (
                <div key={field.id} className='p-2 border border-dashed rounded-lg gap-x-2'>
                  <div className='flex justify-between'>
                    <FormField
                      control={form.control}
                      name={`gallery.${index}.imageUrl`}
                      render={({ field }) => (
                        <FormItem>
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
                    <Button
                      type="button"
                      size="sm"
                      variant='destructive'
                      onClick={() => galleryFieldArray.remove(index)}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name={`gallery.${index}.comment`}
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Comment</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a little bit about this image"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </section>
          <Button type="submit" className='ml-auto' disabled={loading}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
