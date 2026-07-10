import type { Metadata } from 'next'
import {
  ContainerContent,
  ContainerContentDescription,
  ContainerContentHeader,
  ContainerContentTitle,
} from '@/components/container'
import { OverviewGrid } from './_components/overview-grid'

export const metadata: Metadata = {
  title: 'Overview',
}

export default function OverviewPage() {
  return (
    <ContainerContent>
      <ContainerContentHeader>
        <ContainerContentTitle>Financial insights</ContainerContentTitle>

        <ContainerContentDescription>
          Get a quick overview of your financial health and performance.
        </ContainerContentDescription>
      </ContainerContentHeader>

      <OverviewGrid />
    </ContainerContent>
  )
}
