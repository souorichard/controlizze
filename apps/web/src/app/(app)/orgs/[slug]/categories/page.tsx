import { CirclePlus } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

import { getCurrentOrganization } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { CategoriesTable } from './_components/categories-table'
import { CategoriesFiltersDialog } from './_components/filters/categories-filters-dialog'
import { LiveCategoryNameFilter } from './_components/filters/live-category-name-filter'

export const metadata: Metadata = {
  title: 'Categories',
}

export default async function CategoriesPage() {
  const currentOrganization = await getCurrentOrganization()

  return (
    <>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold md:text-2xl">Categories</h1>
        <p className="text-muted-foreground">
          View all categories of this organization
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <LiveCategoryNameFilter />
            <CategoriesFiltersDialog />
          </div>
          <Separator orientation="vertical" className="hidden h-5! lg:block" />
          <Button className="w-full lg:w-auto" asChild>
            <Link href={`/orgs/${currentOrganization}/create-category`}>
              <CirclePlus className="size-4" />
              New category
            </Link>
          </Button>
        </div>

        <CategoriesTable />
      </div>
    </>
  )
}
