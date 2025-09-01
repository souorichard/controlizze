'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AlertCircle, Bell, Check, X } from 'lucide-react'
import { useState } from 'react'

import { getPendingInvites } from '@/http/invite/get-pending-invites'
import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Separator } from '../ui/separator'
import { acceptInviteAction, rejectInviteAction } from './actions'

dayjs.extend(relativeTime)

export function PendingInvites() {
  const queryClient = useQueryClient()

  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: getPendingInvites,
  })

  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction(inviteId)

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  async function handleAcceptInvite(inviteId: string) {
    await acceptInviteAction(inviteId)

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
    queryClient.invalidateQueries({ queryKey: ['organizations'] })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            'relative',
            (data?.invites?.length ?? 0) > 0 &&
              !isOpen &&
              !isLoading &&
              `after:bg-destructive after:absolute after:top-0 after:right-1 after:flex after:size-4 after:items-center after:justify-center after:rounded-full after:text-[0.625rem] after:content-['${data?.invites.length}']`,
          )}
        >
          <Bell className="size-4" />
          <span className="sr-only">Pending invites</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="space-y-4">
        <h4 className="text-sm leading-none font-medium">
          Pending invites ({data?.invites.length ?? 0})
        </h4>

        <Separator />

        <div className="flex flex-col gap-2">
          {data?.invites.length === 0 && (
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="text-primary size-4" />
              <span className="text-sm">No invites.</span>
            </div>
          )}

          {data?.invites.map((invite) => {
            return (
              <div
                key={invite.id}
                className="space-y-2 rounded-md border px-4 py-3"
              >
                <p className="text-muted-foreground text-xs leading-relaxed">
                  <span className="text-foreground font-medium">
                    {invite.author?.name ?? 'Someone'}
                  </span>{' '}
                  invited you to join{' '}
                  <span className="text-foreground font-medium">
                    {invite.organization.name}.
                  </span>{' '}
                  <span className="text-[0.625rem]">
                    {dayjs(invite.createdAt).fromNow()}
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={handleRejectInvite.bind(null, invite.id)}
                  >
                    <X className="size-4" />
                    Reject
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    className="text-primary hover:text-primary"
                    onClick={handleAcceptInvite.bind(null, invite.id)}
                  >
                    <Check className="size-4" />
                    Accept
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
