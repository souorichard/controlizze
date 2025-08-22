import { TransactionForm } from '@/components/transaction-form'

export default function CreateTransactionPage() {
  return (
    <>
      <h1 className="text-xl font-semibold md:text-2xl">Create transaction</h1>

      <TransactionForm />
    </>
  )
}
