'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ErrorMessage } from '../error-message'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Input } from '../ui/input'
import { createOrgAction } from './actions'
import { type CreateOrgData, createOrgSchema } from './schemas'

export function OrgForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrgData>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: '',
    },
  })

  async function handleUpsertOrg({ name }: CreateOrgData) {
    const { success, message } = await createOrgAction({ name })

    if (!success) {
      toast.error(message)

      return
    }

    toast.success(message)
    router.back()
  }

  return (
    <form onSubmit={handleSubmit(handleUpsertOrg)} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Displayed name</CardTitle>
          <CardDescription>
            This is your org's visible name within Controlizze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Input
              placeholder="Acme Inc."
              disabled={isSubmitting}
              {...register('name')}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>
        </CardContent>
        <CardFooter>
          <span className="text-sm text-muted-foreground">
            Please use 32 characters at maximum
          </span>

          {/* <Button className="ml-auto">Salvar</Button> */}
        </CardFooter>
      </Card>

      {/* <Card>
        <div className="pr-4 flex items-center gap-3">
          <CardHeader className="flex-1">
            <CardTitle>Organization avatar</CardTitle>
            <CardDescription>
              This is your org's avatar. <br /> After create your org, you can
              update the avatar
            </CardDescription>
          </CardHeader>

          <Avatar className="size-16 transition-all cursor-pointer hover:opacity-90">
            <AvatarImage src="https://avatars.githubusercontent.com/u/101836586?s=400&u=e091da23eabfd8b6abd1515212cba9f98fc923c5&v=4" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
        </div>
        <CardFooter>
          <span className="text-sm text-muted-foreground">
            An avatar is optional but strongly recommended.
          </span>

          <Button className="hidden ml-auto">Salvar</Button>
        </CardFooter>
      </Card> */}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Salvar'}
      </Button>
    </form>
  )
}
