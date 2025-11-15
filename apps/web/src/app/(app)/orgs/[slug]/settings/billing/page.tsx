import { Metadata } from 'next'

import { Separator } from '@/components/ui/separator'

import { FreePlan } from './_components/free-plan'
import { PaymentMethod } from './_components/payment-method'
import { ProPlan } from './_components/pro-plan'

export const metadata: Metadata = {
  title: 'Settings: Billing',
}

export default function BillingPage() {
  return (
    <main className="w-full space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <FreePlan />
        <ProPlan />
      </div>
      <Separator />
      <PaymentMethod />
    </main>
  )
}
