import type { Metadata } from 'next'
import {
  ContainerContent,
  ContainerContentDescription,
  ContainerContentHeader,
  ContainerContentTitle,
} from '@/components/container'
import { TransactionsView } from './_components/transactions-view'

export const metadata: Metadata = {
  title: 'Transações',
}

export default function TransactionsPage() {
  return (
    <ContainerContent>
      <ContainerContentHeader>
        <ContainerContentTitle>Transações</ContainerContentTitle>
        <ContainerContentDescription>
          Transforme dados financeiros em decisões mais inteligentes
        </ContainerContentDescription>
      </ContainerContentHeader>

      <TransactionsView />
    </ContainerContent>
  )
}
