'use client'

import { useState } from 'react'
import type { Transaction } from '@/interfaces/transaction'
import { UpsertTransactionDialog } from './dialogs/upsert-transaction-dialog'
import { TransactionsListItem } from './transactions-list-item'

interface TransactionsListProps {
  transactions: Transaction[]
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null)

  return (
    <>
      <div className="[&_div:last-child]:border-0">
        {transactions.map((transaction) => {
          return (
            <TransactionsListItem
              key={transaction.id}
              transaction={transaction}
              onClick={() => setSelectedTransaction(transaction)}
            />
          )
        })}
      </div>

      <UpsertTransactionDialog
        mode="update"
        transaction={selectedTransaction ?? undefined}
        open={!!selectedTransaction}
        onOpenChange={(open) => {
          if (!open) setSelectedTransaction(null)
        }}
      />
    </>
  )
}
