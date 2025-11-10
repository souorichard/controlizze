import { CirclePlus } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import { CategoriesTable } from './_components/categories-table'
import { LiveCategoryNameFilter } from './_components/filters/live-category-name-filter'

export const metadata: Metadata = {
  title: 'Categories',
}

export default function CategoriesPage() {
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
            <Select>
              <SelectTrigger className="w-full lg:w-[160px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="REVENUE">Revenue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator orientation="vertical" className="hidden h-5! lg:block" />
          <Button className="w-full lg:w-auto" asChild>
            <Link href={`/orgs/acme-admin/create-category`}>
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
