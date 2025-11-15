import { Check } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

const features = [
  'Up to 1 organization',
  'Basic analytics',
  'Up to 75 transactions',
  'Up to 5 categories',
]

export function FreePlan() {
  return (
    <div className="space-y-8 rounded-xl border p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="font-semibold">Free plan</h2>
          <p className="text-muted-foreground text-sm">
            Get started with the basics
          </p>
        </div>

        <Badge className="text-primary">Current plan</Badge>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-muted-foreground text-3xl">R$</span>
        <span className="text-5xl font-semibold tracking-tight">0</span>
        <span className="text-muted-foreground">/ month</span>
      </div>

      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="bg-muted-foreground/15 flex h-5 w-5 items-center justify-center rounded-full">
              <Check className="text-muted-foreground h-3 w-3" />
            </div>
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
