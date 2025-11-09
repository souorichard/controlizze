import { CirclePlus } from 'lucide-react'
import Link from 'next/link'

import { getCurrentOrganization } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { LiveDescriptionFilter } from './live-description-filter'
import { SelectFiltersDialog } from './select-filters-dialog'

export async function Filters() {
  const currentOrganization = await getCurrentOrganization()

  return (
    <div className="flex flex-col items-center gap-4 lg:flex-row">
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <LiveDescriptionFilter />
        <SelectFiltersDialog />
      </div>
      <Separator orientation="vertical" className="hidden h-5! lg:block" />
      <Button className="w-full lg:w-auto" asChild>
        <Link href={`/orgs/${currentOrganization}/create-transaction`}>
          <CirclePlus className="size-4" />
          New transaction
        </Link>
      </Button>
    </div>
  )
}
