import type { Metadata } from 'next'
import {
  ContainerContent,
  ContainerContentDescription,
  ContainerContentHeader,
  ContainerContentTitle,
} from '@/components/container'
import { TransactionsView } from './_components/transactions-view'

export const metadata: Metadata = {
  title: 'Transactions',
}

export default function TransactionsPage() {
  return (
    <ContainerContent>
      <ContainerContentHeader>
        <ContainerContentTitle>Transactions</ContainerContentTitle>
        <ContainerContentDescription>
          Transform financial data into smarter decisions
        </ContainerContentDescription>
      </ContainerContentHeader>

      <TransactionsView />
    </ContainerContent>
  )
}
