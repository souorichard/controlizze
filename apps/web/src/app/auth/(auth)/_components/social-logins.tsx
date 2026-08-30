'use client'

import Image from 'next/image'
import googleIcon from '@/assets/icons/google-icon.svg'
import { Button } from '@/components/ui/button'
import { signInWithGoogleAction } from '../actions'

export function SocialLogins() {
  return (
    <div className="flex flex-col items-center gap-4 md:flex-row">
      <form action={signInWithGoogleAction} className="w-full flex-1">
        <Button variant="outline" className="w-full">
          <Image src={googleIcon} alt="Google" className="size-4" />
          Sign in with Google
        </Button>
      </form>
      {/* <form action={signInWithGithubAction} className="w-full flex-1">
        <Button variant="outline" className="w-full">
          <Image src={githubIcon} alt="Github" className="size-4" />
          Continue with Github
        </Button>
      </form> */}
    </div>
  )
}
