'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Transaction } from '@/interfaces/transaction'
import { UpsertTransactionForm } from './upsert-transaction-form'

interface UpsertTransactionDialogProps {
  mode?: 'create' | 'update'
  transaction?: Transaction
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpsertTransactionDialog({
  mode = 'create',
  transaction,
  open,
  onOpenChange,
}: UpsertTransactionDialogProps) {
  const [selectedType, setSelectedType] = useState<Type>(
    (transaction?.type.toLowerCase() as Type) ?? 'expense',
  )

  useEffect(() => {
    if (transaction?.type) {
      setSelectedType(transaction.type.toLowerCase() as Type)
    }
  }, [transaction])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create transaction' : 'Update transaction'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Fill in the details below to record a new transaction.'
              : 'Update the details of your transaction below.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue={selectedType}
          onValueChange={(value) => setSelectedType(value as Type)}
        >
          <TabsList className="w-full">
            <TabsTrigger value="expense" className="gap-2">
              <TrendingDown className="size-3 text-destructive" />
              Expense
            </TabsTrigger>
            <TabsTrigger value="income" className="gap-2">
              <TrendingUp className="size-3 text-emerald-500" />
              Income
            </TabsTrigger>
          </TabsList>

          <UpsertTransactionForm
            mode={mode}
            type={selectedType}
            initialData={transaction}
            setDialogState={onOpenChange}
          />
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
