import { ArrowRight, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import controlizzeLogo from '@/assets/brand/logo.svg'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function PaymentConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-[url(../assets/home-bg.png)] bg-cover bg-center bg-no-repeat px-5 xl:bg-auto">
      <Image src={controlizzeLogo} className="w-52" alt="Controlizze" />
      <Card className="w-full max-w-2xl py-10">
        <CardContent className="space-y-10 px-10 text-center">
          <div className="flex flex-col items-center gap-6">
            <ShoppingBag className="text-primary size-14" />
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Subscription confirmed</h1>
              <p className="text-muted-foreground text-sm">
                Thank you for joining our Controlizze community.
              </p>
            </div>
          </div>

          <p className="text-pretty">
            Your subscription was processed successfully and your account is now
            active. Now, just enjoy our content.
          </p>

          <Button size="lg" variant="outline" asChild>
            <Link href="/">
              Go to inicial page
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
