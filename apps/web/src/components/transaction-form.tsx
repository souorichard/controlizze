'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import { createTransactionAction } from '@/app/(app)/organizations/[slug]/transactions/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { CategorySelect } from './category-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const upsertTransactionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  category: z.string({ error: 'Category is required' }),
  type: z.enum(['EXPENSE', 'REVENUE'], { error: 'Type is required' }),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED'], {
    error: 'Status is required',
  }),
  amount: z.string().min(1, 'Amount is required'),
})

export type UpsertTransactionFormData = z.infer<typeof upsertTransactionSchema>

export function TransactionForm({ organization }: { organization: string }) {
  const queryClient = useQueryClient()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isLoading },
    reset,
  } = useForm<UpsertTransactionFormData>({
    resolver: zodResolver(upsertTransactionSchema),
  })

  async function handleUpsertTransaction({
    description,
    category,
    type,
    status,
    amount,
  }: UpsertTransactionFormData) {
    const { success, message } = await createTransactionAction({
      description,
      category,
      type,
      status,
      amount,
    })

    if (!success) {
      toast.error(message)

      return
    }

    queryClient.invalidateQueries({ queryKey: ['transactions', organization] })
    toast.success(message)
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(handleUpsertTransaction)}
      className="space-y-5"
    >
      <div className="space-y-1.5">
        <Label htmlFor="name">Description</Label>
        <Input
          id="name"
          placeholder="Enter a description"
          {...register('description')}
        />

        {errors.description && (
          <span className="text-destructive block text-xs">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Category</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => {
            return (
              <CategorySelect
                value={field.value}
                onValueChange={field.onChange}
                className="w-full"
              />
            )
          }}
        />
        {errors.category && (
          <span className="text-destructive block text-xs">
            {errors.category.message}
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
                  <SelectValue placeholder="Select a type" />
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

      <div className="space-y-1.5">
        <Label htmlFor="status">Status</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => {
            return (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
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

      <div className="space-y-1.5">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          placeholder="Enter an amount"
          {...register('amount')}
        />

        {errors.amount && (
          <span className="text-destructive block text-xs">
            {errors.amount.message}
          </span>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save transaction'
        )}
      </Button>
    </form>
  )
}
