"use client"

import axios from 'axios'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { Profile } from '@prisma/client'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const roles = [
  { id: 1, label: 'User', value: 'USER' },
  { id: 2, label: 'Technician', value: 'TECHNICIAN' },
]

const formSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().email(),
  register: z.string().nullable(),
  role: z.string().min(1),
})

type UserFormValues = z.infer<typeof formSchema>

type UserFormProps = {
  initialData: Profile | null
}

export function UserForm({
  initialData
}: UserFormProps) {
  const params = useParams() as { userId: string }
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = 'Edit user'
  const description = 'Edit an existing user.'
  const action = 'Edit user'
  const toastMessage = 'User edited'

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      register: '',
      role: '',
    },
  })

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true)

      if (initialData) {
        await axios.put(`/api/users/${params.userId}`, data)
      } else {
        await axios.post('/api/users', data)
      }

      router.refresh();
      router.push(`/users`);
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

      await axios.delete(`/api/users/${params.userId}`);

      router.refresh()
      router.push('/users');
      toast.success('User deleted');
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
                  <FormLabel>User name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Username' {...field} />
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
                  <FormLabel>User email</FormLabel>
                  <FormControl>
                    <Input disabled placeholder='Email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="register"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User register</FormLabel>
                  <FormControl>
                    {/* @ts-ignore */}
                    <Input disabled={loading} placeholder='Register number' {...field} />
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
                  <FormLabel>User role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData ? initialData.role : undefined}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
