import Image from 'next/image'
import githubIcon from '@/assets/icons/github-icon.svg'
import googleIcon from '@/assets/icons/google-icon.svg'
import { Button } from '@/components/ui/button'

export function SocialLogins() {
  return (
    <div className="flex items-center gap-4">
      <Button size="lg" variant="outline" className="h-10 flex-1">
        <Image src={googleIcon} alt="Google" className="size-4" />
        Google
      </Button>
      <Button size="lg" variant="outline" className="h-10 flex-1">
        <Image src={githubIcon} alt="Github" className="size-4" />
        Github
      </Button>
    </div>
  )
}
