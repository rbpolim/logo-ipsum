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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const roles = [
  { id: 1, label: 'Technician', value: 'TECHNICIAN' },
  { id: 2, label: 'Manager', value: 'MANAGER' },
]

const techPositions = [
  { id: '1', label: 'Engenheiro Senior HVAC-R' },
  { id: '2', label: 'Engenheiro Junior HVAC-R' },
  { id: '3', label: 'Técnico Sênior HVAC-R' },
  { id: '4', label: 'Técnico de Automação' },
  { id: '5', label: 'Eletrotécnico' },
  { id: '6', label: 'Eletricista' },
  { id: '7', label: 'Mecânico HVAC-R' },
  { id: '8', label: 'Caldeireiro' },
  { id: '9', label: 'Soldador' },
  { id: '10', label: 'Duteiro' },
  { id: '11', label: 'Assistente Técnico' },
  { id: '12', label: 'Encarregado de Higienização' },
]

const managerPositions = [
  { id: '1', label: 'CEO' },
  { id: '2', label: 'Engenheiro' },
]

const formSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().email(),
  register: z.string().nullable(),
  role: z.string().min(1),
  position: z.string().nullable(),
})

type ProfileFormValues = z.infer<typeof formSchema>

type ProfileFormProps = {
  initialData: Profile | null
}

export function ProfileForm({
  initialData
}: ProfileFormProps) {
  const params = useParams() as { profileId: string }
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = 'Edit profile'
  const description = 'Edit an existing profile.'
  const action = 'Edit profile'
  const toastMessage = 'Profile edited'

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      register: '',
      role: '',
      position: '',
    },
  })

  const watchRole = form.watch('role')

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setLoading(true)

      await axios.put(`/api/profiles/${params.profileId}`, data)

      router.refresh();
      router.push(`/profiles`);
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

      await axios.delete(`/api/profiles/${params.profileId}`);

      router.refresh()
      router.push('/profiles');
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
                    defaultValue={initialData?.role === 'USER' ? undefined : initialData?.role}
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
            {watchRole === 'MANAGER' && (
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position manager</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={initialData?.position || '' || undefined}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="item-aligned">
                        {managerPositions.map((position) => (
                          <SelectItem key={position.id} value={position.label}>
                            {position.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {watchRole === 'TECHNICIAN' && (
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position technician</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={initialData?.position || '' || undefined}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="item-aligned">
                        {techPositions.map((position) => (
                          <SelectItem key={position.id} value={position.label}>
                            {position.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
