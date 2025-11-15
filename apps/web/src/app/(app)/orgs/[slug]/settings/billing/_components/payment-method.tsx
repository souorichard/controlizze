import { CreditCard } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function PaymentMethod() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-semibold">Payment method</h2>
        <p className="text-muted-foreground text-sm">
          Manage organization's payment method
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border p-4">
        <div className="flex items-center gap-2">
          <div className="bg-muted/40 flex items-center justify-between rounded-md p-3">
            <CreditCard className="text-muted-foreground size-5" />
          </div>
          <div>
            <p className="">•••• •••• •••• 4242</p>
            <p className="text-muted-foreground text-sm">Expires 12/2025</p>
          </div>
        </div>
        <Badge className="text-muted-foreground">Default</Badge>
      </div>

      <Button variant="outline" className="w-full">
        Update payment method
      </Button>
    </div>
  )
}
