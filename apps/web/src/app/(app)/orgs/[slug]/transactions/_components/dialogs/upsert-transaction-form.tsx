'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronDownIcon, Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CategorySelect } from '@/components/category-select'
import { ErrorMessage } from '@/components/error-message'
import { StatusSelect } from '@/components/status-select'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useOrg } from '@/hooks/use-org'
import type { Transaction } from '@/interfaces/transaction'
import { dayjs } from '@/lib/dayjs'
import { createTransactionAction } from '../../actions'
import {
  type UpsertTransactionFormData,
  upsertTransactionSchema,
} from '../../schemas'

interface UpsertTransactionFormProps {
  mode?: 'create' | 'update'
  type: Type
  initialData?: Transaction
}

export function UpsertTransactionForm({
  mode = 'create',
  type,
  initialData,
}: UpsertTransactionFormProps) {
  const org = useOrg()
  const queryClient = useQueryClient()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpsertTransactionFormData>({
    resolver: zodResolver(upsertTransactionSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      type,
      category: initialData?.category?.id ?? '',
      status: initialData?.status ?? '',
      amount: (initialData?.amount as unknown as string) ?? '',
      transactionDate: initialData?.transactionDate ?? '',
    },
  })

  async function upsertTransaction({
    title,
    description,
    type,
    category,
    status,
    amount,
    transactionDate,
  }: UpsertTransactionFormData) {
    const { success, message } = await createTransactionAction({
      title,
      description,
      type,
      category,
      status,
      amount,
      transactionDate,
    })

    if (!success) {
      toast.error(message)

      return
    }

    queryClient.invalidateQueries({ queryKey: ['transactions', org] })
    queryClient.invalidateQueries({ queryKey: ['metrics', org] })
    toast.success(message)
  }

  return (
    <form onSubmit={handleSubmit(upsertTransaction)} className="space-y-3">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Title"
          disabled={isSubmitting}
          {...register('title')}
        />
        {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
      </div>

      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Description (Opcional)"
          disabled={isSubmitting}
          {...register('description')}
        />
        {errors.description && (
          <ErrorMessage>{errors.description.message}</ErrorMessage>
        )}
      </div>

      <div className="space-y-2">
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <CategorySelect
              mode="form"
              className="w-full"
              value={field.value}
              onValueChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
        {errors.category && (
          <ErrorMessage>{errors.category.message}</ErrorMessage>
        )}
      </div>

      <div className="space-y-2">
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <StatusSelect
              mode="form"
              className="w-full"
              value={field.value}
              onValueChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
        {errors.status && <ErrorMessage>{errors.status.message}</ErrorMessage>}
      </div>

      <div className="space-y-2">
        <Controller
          control={control}
          name="amount"
          render={({ field }) => {
            function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
              const rawValue = e.target.value.replace(/\D/g, '')
              const cents = Number(rawValue)
              const formatted = (cents / 100).toFixed(2)

              field.onChange(formatted)
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
        {errors.amount && <ErrorMessage>{errors.amount.message}</ErrorMessage>}
      </div>

      <div className="space-y-2">
        <Controller
          control={control}
          name="transactionDate"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!field.value}
                  className="w-full justify-between dark:bg-card text-left font-normal data-[empty=true]:text-muted-foreground"
                >
                  {field.value ? (
                    dayjs(field.value).format('MMM D, YYYY')
                  ) : (
                    <span>Pick a transaction date</span>
                  )}
                  <ChevronDownIcon data-icon="inline-end" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => field.onChange(date?.toISOString() ?? '')}
                  defaultMonth={field.value ? new Date(field.value) : undefined}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.amount && <ErrorMessage>{errors.amount.message}</ErrorMessage>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Save'}
      </Button>
    </form>
  )
}
