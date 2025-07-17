import Image from 'next/image'

import {
  signInWithGithubAction,
  signInWithGoogleAction,
} from '@/app/auth/actions'
import githubIcon from '@/assets/github-icon.svg'
import googleIcon from '@/assets/google-icon.svg'

import { Button } from '../ui/button'

interface SocialSignInButtonsProps {
  disabled: boolean
}

export function SocialSignInButtons({ disabled }: SocialSignInButtonsProps) {
  return (
    <div className="grid grid-rows-2 gap-3 md:grid-cols-2 md:grid-rows-none">
      <form action={signInWithGithubAction}>
        <Button
          type="submit"
          variant="outline"
          className="w-full"
          disabled={disabled}
        >
          <Image
            src={githubIcon}
            alt="Github"
            className="size-4 scale-125 invert"
          />
          Sign in with Github
        </Button>
      </form>
      <form action={signInWithGoogleAction}>
        <Button
          type="submit"
          variant="outline"
          className="w-full"
          disabled={disabled}
        >
          <Image src={googleIcon} alt="Github" className="size-4" />
          Sign in with Google
        </Button>
      </form>
    </div>
  )
}
