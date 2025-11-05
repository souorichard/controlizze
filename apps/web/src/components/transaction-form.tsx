'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import {
  createTransactionAction,
  updateTransactionAction,
} from '@/app/(app)/orgs/[slug]/transactions/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Transaction } from '@/interfaces/transaction'

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

interface TransactionFormProps {
  organization: string
  transactionId?: string
  initialData?: Transaction
  isUpdating?: boolean
  dialogState?: (state: boolean) => void
}

export function TransactionForm({
  organization,
  transactionId,
  initialData,
  isUpdating,
  dialogState,
}: TransactionFormProps) {
  const queryClient = useQueryClient()

  const router = useRouter()

  const {
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors, isLoading },
    reset,
  } = useForm<UpsertTransactionFormData>({
    resolver: zodResolver(upsertTransactionSchema),
    defaultValues: {
      description: initialData?.description ?? '',
      category: initialData?.category ?? '',
      type: initialData?.type ?? 'EXPENSE',
      status: initialData?.status ?? 'PENDING',
      amount: initialData?.amount ? String(initialData.amount) : '',
    },
  })

  async function handleUpsertTransaction({
    description,
    category,
    type,
    status,
    amount,
  }: UpsertTransactionFormData) {
    const { success, message } = isUpdating
      ? await updateTransactionAction({
          transactionId: transactionId!,
          description,
          category,
          type,
          status,
          amount,
        })
      : await createTransactionAction({
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
    queryClient.invalidateQueries({ queryKey: ['analysis', organization] })
    toast.success(message)

    if (!initialData && dialogState) {
      reset()

      dialogState(false)
    }

    router.back()
  }

  const type = watch('type')

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
        <Label htmlFor="category">Category</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => {
            return (
              <CategorySelect
                value={field.value}
                onValueChange={field.onChange}
                type={type}
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
        {/* <Input
          id="amount"
          placeholder="Enter an amount"
          {...register('amount')}
        /> */}
        <Controller
          control={control}
          name="amount"
          render={({ field }) => {
            function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
              // get only numbers
              const rawValue = e.target.value.replace(/\D/g, '')

              // divide by 100 to get the correct value
              const numericValue = Number(rawValue) / 100

              // send numeric value to form without R$
              field.onChange(numericValue.toString())
            }

            return (
              <Input
                id="amount"
                placeholder="R$ 0,00"
                value={
                  field.value
                    ? Number(field.value).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })
                    : ''
                }
                onChange={handleChange}
              />
            )
          }}
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
