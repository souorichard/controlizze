import Image from 'next/image'

import githubIcon from '@/assets/icons/github-icon.svg'
import googleIcon from '@/assets/icons/google-icon.svg'
import { Button } from '@/components/ui/button'

import { signInWithGithubAction, signInWithGoogleAction } from '../actions'

interface SocialButtonsProps {
  isLoading?: boolean
}

export function SocialButtons({ isLoading = false }: SocialButtonsProps) {
  return (
    <div className="flex gap-3">
      <form action={signInWithGoogleAction} className="w-full">
        <Button
          type="submit"
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          <Image src={googleIcon} alt="Google icon" className="size-4" />
          Google
        </Button>
      </form>

      <form action={signInWithGithubAction} className="w-full">
        <Button
          type="submit"
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          <Image
            src={githubIcon}
            alt="Github icon"
            className="size-4 scale-125 dark:invert"
          />
          Github
        </Button>
      </form>
    </div>
  )
}
