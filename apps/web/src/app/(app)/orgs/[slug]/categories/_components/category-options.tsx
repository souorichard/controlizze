'use client'

import { Copy, EllipsisVertical, SquarePen } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Category } from '@/interfaces/category'
import { getInitials } from '@/utils/get-initials'

import { UpdateCategoryDialog } from './dialogs/update-category-dialog'

interface CategoryOptionsProps {
  category: Category
}

export function CategoryOptions({ category }: CategoryOptionsProps) {
  function handleCopyCategoryId() {
    navigator.clipboard.writeText(category.id)

    toast.success('Category ID copied to clipboard')
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline">
            <EllipsisVertical className="size-4" />
            <span className="sr-only">Options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Created by</DropdownMenuLabel>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Avatar className="size-6">
              {category.owner.avatarUrl && (
                <AvatarImage
                  src={category.owner.avatarUrl as string}
                  alt="Owner avatar"
                />
              )}
              <AvatarFallback>
                {getInitials(category.owner.name ?? 'Unknown')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">{category.owner.name}</span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyCategoryId}>
            <Copy className="size-4" />
            Category ID
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <SquarePen className="size-4" />
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateCategoryDialog categoryId={category.id} initialData={category} />
    </Dialog>
  )
}
