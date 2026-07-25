'use client'

import { CirclePlus, TrendingDown, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<Type>(
    (transaction?.type.toLowerCase() as Type) ?? 'expense',
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">
          <CirclePlus className="size-4" />
          New transaction
        </Button>
      </DialogTrigger>

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
            type={selectedType}
            initialData={transaction}
            setDialogState={setIsOpen}
          />
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
