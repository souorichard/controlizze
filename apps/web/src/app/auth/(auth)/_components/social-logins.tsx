'use client'

import Image from 'next/image'
import githubIcon from '@/assets/icons/github-icon.svg'
import googleIcon from '@/assets/icons/google-icon.svg'
import { Button } from '@/components/ui/button'
import { signInWithGithubAction, signInWithGoogleAction } from '../actions'

export function SocialLogins() {
  return (
    <div className="flex items-center gap-4">
      <form action={signInWithGoogleAction} className="flex-1">
        <Button size="lg" variant="outline" className="h-10 w-full">
          <Image src={googleIcon} alt="Google" className="size-4" />
          Continue with Google
        </Button>
      </form>
      <form action={signInWithGithubAction} className="flex-1">
        <Button size="lg" variant="outline" className="h-10 w-full">
          <Image src={githubIcon} alt="Github" className="size-4" />
          Continue with Github
        </Button>
      </form>
    </div>
  )
}
