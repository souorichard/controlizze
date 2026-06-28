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
        <ContainerContentTitle>
          Insights{' '}
          <span className="bg-linear-to-r from-primary via-primary/60 to-primary bg-clip-text text-transparent animate-shimmer">
            financeiros
          </span>
        </ContainerContentTitle>

        <ContainerContentDescription>
          Transforme dados financeiros em decisões mais inteligentes
        </ContainerContentDescription>
      </ContainerContentHeader>

      <OverviewGrid />
    </ContainerContent>
  )
}
