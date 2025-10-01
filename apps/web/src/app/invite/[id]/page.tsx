import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ArrowRight } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth, isAuthenticated } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { acceptInvite } from '@/http/invite/accept-invite'
import { getInvite } from '@/http/invite/get-invite'
import { getInitials } from '@/utils/get-initials'

dayjs.extend(relativeTime)

interface InvitePageProps {
  params: {
    id: string
  }
}

export default async function InvitePage({ params }: InvitePageProps) {
  const inviteId = params.id

  const { invite } = await getInvite(inviteId)

  const isUserAuthenticated = await isAuthenticated()

  let currentUserEmail = null

  if (isUserAuthenticated) {
    const { user } = await auth()

    currentUserEmail = user.email
  }

  const isUserAuthenticatedWithSameEmailFromInvite =
    currentUserEmail === invite.email

  async function signInFromInvite() {
    'use server'

    const cookieStore = await cookies()

    cookieStore.set('invite', inviteId, {
      path: '/',
    })

    redirect(`/auth/sign-in?email=${invite.email}`)
  }

  async function acceptInviteAction() {
    'use server'

    await acceptInvite(inviteId)

    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="border-primary size-16 border-2">
            {invite.author?.avatarUrl && (
              <AvatarImage src={invite.author?.avatarUrl as string} />
            )}
            <AvatarFallback>
              {getInitials(invite.author?.name ?? 'Undefined')}
            </AvatarFallback>
          </Avatar>

          <p className="text-muted-foreground text-center leading-relaxed">
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
        </div>

        <Separator />

        {!isUserAuthenticated && (
          <form action={signInFromInvite}>
            <Button type="submit" className="w-full">
              Sign in to accept the invite
              <ArrowRight className="size-4" />
            </Button>
          </form>
        )}

        {isUserAuthenticatedWithSameEmailFromInvite && (
          <form action={acceptInviteAction}>
            <Button type="submit" variant="secondary" className="w-full">
              Join {invite.organization.name}
              <ArrowRight className="size-4" />
            </Button>
          </form>
        )}

        {isUserAuthenticated && !isUserAuthenticatedWithSameEmailFromInvite && (
          <div className="space-y-4">
            <p className="text=balance text-muted-foreground text-center text-sm leading-relaxed">
              This invite was sent to{' '}
              <span className="text-foreground font-medium">
                {invite.email}
              </span>{' '}
              but you are currently authenticated as{' '}
              <span className="text-foreground font-medium">
                {currentUserEmail}
              </span>
              .
            </p>

            <div className="space-y-2">
              <Button variant="secondary" className="w-full" asChild>
                <a href="/api/auth/sign-out">Sign out from current account</a>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/">Back to dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
