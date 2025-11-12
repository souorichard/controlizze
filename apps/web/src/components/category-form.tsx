'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import {
  createCategoryAction,
  updateCategoryAction,
} from '@/app/(app)/orgs/[slug]/categories/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useOrganization } from '@/hooks/use-organization'
import { Category } from '@/interfaces/category'
import { baseColors } from '@/utils/tailwind-colors'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const upsertCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().min(1, 'Color is required'),
  type: z.enum(['EXPENSE', 'REVENUE'], {
    error: 'Type is required',
  }),
})

export type UpsertCategoryFormData = z.infer<typeof upsertCategorySchema>

interface CategoryFormProps {
  categoryId?: string
  initialData?: Category
  isUpdating?: boolean
  dialogState?: (state: boolean) => void
}

export function CategoryForm({
  categoryId,
  initialData,
  isUpdating,
  dialogState,
}: CategoryFormProps) {
  const queryClient = useQueryClient()

  const router = useRouter()
  const organization = useOrganization()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isLoading },
    reset,
  } = useForm<UpsertCategoryFormData>({
    resolver: zodResolver(upsertCategorySchema),
    defaultValues: {
      name: initialData?.name ?? '',
      color: initialData?.color ?? '',
      type: initialData?.type ?? 'EXPENSE',
    },
  })

  async function handleUpsertCategory({
    name,
    color,
    type,
  }: UpsertCategoryFormData) {
    const { success, message } = isUpdating
      ? await updateCategoryAction({
          categoryId: categoryId!,
          name,
          color,
          type,
        })
      : await createCategoryAction({
          name,
          color,
          type,
        })

    if (!success) {
      toast.error(message)

      return
    }

    queryClient.invalidateQueries({ queryKey: ['categories', organization] })
    queryClient.invalidateQueries({ queryKey: ['analysis', organization] })
    toast.success(message)

    if (!initialData && dialogState) {
      reset()

      dialogState(false)

      router.back()
    }
  }

  return (
    <form onSubmit={handleSubmit(handleUpsertCategory)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter name" {...register('name')} />

        {errors.name && (
          <span className="text-destructive block text-xs">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="color">Color</Label>
        <Controller
          control={control}
          name="color"
          render={({ field }) => {
            return (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {baseColors.map((color) => (
                    <SelectItem key={color.name} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="size-2 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                        <p className="capitalize">{color.name}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }}
        />

        {errors.color && (
          <span className="text-destructive block text-xs">
            {errors.color.message}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="type">Type</Label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => {
            return (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                  <SelectItem value="REVENUE">Revenue</SelectItem>
                </SelectContent>
              </Select>
            )
          }}
        />
        {errors.type && (
          <span className="text-destructive block text-xs">
            {errors.type.message}
          </span>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save category'
        )}
      </Button>
    </form>
  )
}
