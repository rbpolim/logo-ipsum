'use client';

import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Calendar } from "@/components/ui/calendar";

import { Container } from "./container"

import { cn } from "@/lib/utils";

enum STEPS {
  DATE_TIME = 0,
  EQUIPMENT = 1,
  TECHNICIANS = 2,
  SERVICES = 3,
  GALLERY = 4,
}

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

type ReportFormTestProps = {
  initialData?: any
}

export const ReportFormTest = ({
  initialData
}: ReportFormTestProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.DATE_TIME);

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

  const onBack = () => {
    setStep((value) => value - 1);
  }

  const onNext = () => {
    setStep((value) => value + 1);
  }

  const onSubmit = async (data: ReportFormValues) => {
    try {
      console.log('cliquei')

      onNext();

      setIsLoading(true)

      console.log(data)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  let bodyContent = (
    <div className="space-y-4">
      <h2>Date & Time section</h2>
      <div className='grid md:grid-cols-5 gap-8'>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger disabled={isLoading} asChild>
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
                <Input type="time" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button type="submit">
        {action}
      </Button>
      {/* <div className="flex items-center justify-between">
        <Button onClick={onBack} type="button">
          Back
        </Button>
        <Button onClick={onNext} type="button">
          Next
        </Button>
      </div> */}
    </div>
  )

  if (step === STEPS.EQUIPMENT) {
    bodyContent = (
      <div className="space-y-4">
        <h2>Equipment section</h2>
        <div className='grid md:grid-cols-5 gap-8'>
          <FormField
            control={form.control}
            name="equipment.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>System</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder='System name' {...field} />
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
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder='Local name' {...field} />
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
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder='Type name' {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder='Description name' {...field} />
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
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder='Model name' {...field} />
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
                <FormLabel>Serial</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder='Serial number' {...field} />
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
                <FormLabel>TAG</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder='TAG number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* <div className="flex items-center justify-between">
          <Button onClick={onBack} type="button">
            Back
          </Button>
          <Button onClick={onNext} type="button">
            Next
          </Button>
        </div> */}
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between">
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
          <Container body={bodyContent} />
        </form>
      </Form >
    </>
  )
}