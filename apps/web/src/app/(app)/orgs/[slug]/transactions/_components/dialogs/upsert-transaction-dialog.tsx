'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Transaction } from '@/interfaces/transaction'
import { UpsertTransactionForm } from './upsert-transaction-form'

interface UpsertTransactionDialogProps {
  mode?: 'create' | 'update'
  transaction?: Transaction
}

export function UpsertTransactionDialog({
  mode = 'create',
  transaction,
}: UpsertTransactionDialogProps) {
  return (
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

      <Tabs defaultValue={transaction?.type.toLowerCase() ?? 'expense'}>
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

        {/* TODO: single form instance outside TabsContent to preserve state on tab change and update type prop reactively */}
        <TabsContent value="expense">
          <UpsertTransactionForm type="expense" initialData={transaction} />
        </TabsContent>
        <TabsContent value="income">
          <UpsertTransactionForm type="income" initialData={transaction} />
        </TabsContent>
      </Tabs>
    </DialogContent>
  )
}
