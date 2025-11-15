import { Check, Rocket } from 'lucide-react'

import { Button } from '@/components/ui/button'

const features = [
  'Unlimited organizations',
  'Advanced analytics',
  'Unlimited transactions',
  'Unlimited categories',
  'Team collaboration',
]

export function ProPlan() {
  return (
    <div className="border-primary/50 space-y-8 rounded-xl border p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="font-semibold">Pro plan</h2>
          <p className="text-muted-foreground text-sm">
            Unlock all features and benefits
          </p>
        </div>

        {/* <Badge className="text-primary">Current plan</Badge> */}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-muted-foreground text-3xl">R$</span>
        <span className="text-5xl font-semibold tracking-tight">29,90</span>
        <span className="text-muted-foreground">/ month</span>
      </div>

      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="bg-primary/15 flex h-5 w-5 items-center justify-center rounded-full">
              <Check className="text-primary h-3 w-3" />
            </div>
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <Button className="w-full">
        Upgrade now
        <Rocket className="size-4" />
      </Button>
      {/* <Button variant="outline" className="w-full">
        Cancel subscription
      </Button> */}
    </div>
  )
}
