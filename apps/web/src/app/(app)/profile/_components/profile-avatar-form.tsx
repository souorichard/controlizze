'use client'

import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/utils/get-initials'

import { updateProfileAvatarAction } from '../actions'

const profileAvatarSchema = z.object({
  file: z
    .custom<File>((value) => value instanceof File, 'Select an image.')
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Maximum size: 5MB.')
    .refine(
      (file) => ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type),
      'Invalid format (PNG, JPG, JPEG).',
    ),
})

export type ProfileAvatarFormData = z.infer<typeof profileAvatarSchema>

interface ProfileAvatarFormProps {
  initialData: {
    name: string | null
    avatarUrl: string | null
  }
}

export function ProfileAvatarForm({ initialData }: ProfileAvatarFormProps) {
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(
    initialData?.avatarUrl ?? null,
  )

  function handleClick() {
    inputRef.current?.click()
  }

  function handleSetPreview(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      toast.error('Select an image.')
      return
    }

    if (preview) {
      URL.revokeObjectURL(preview)
    }

    const responseValidation = profileAvatarSchema.safeParse({
      file: selectedFile,
    })

    if (!responseValidation.success) {
      toast.error(responseValidation.error.issues[0].message)
      return
    }

    const selectedFileUrl = URL.createObjectURL(selectedFile)

    setFile(selectedFile)
    setPreview(selectedFileUrl)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  async function handleUploadImage() {
    if (!file) {
      toast.error('Select an image first.')
      return
    }

    const { success, message, savedUrl } = await updateProfileAvatarAction({
      file,
    })

    if (!success) {
      toast.error(message)
      return
    }

    toast.success(message)

    setFile(null)
    setPreview(savedUrl!)

    queryClient.invalidateQueries({ queryKey: ['members'] })
  }

  function handleRemoveImage() {
    setFile(null)
    setPreview(null)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="grid grid-rows-[auto_auto] items-center gap-6 lg:grid-cols-2 lg:grid-rows-none lg:gap-10">
      <div className="space-y-2">
        <h2 className="font-semibold">Profile avatar</h2>
        <p className="text-muted-foreground text-sm">
          Recommended 400x400px, PNG, JPG or JPEG.
        </p>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        {preview ? (
          <Image
            src={preview}
            width={400}
            height={400}
            className="size-14 rounded-full border"
            alt="Image preview"
          />
        ) : (
          <Avatar className="size-14">
            <AvatarFallback>
              {getInitials(initialData?.name ?? 'Undefined')}
            </AvatarFallback>
          </Avatar>
        )}

        <div className="flex flex-col items-center gap-2 lg:flex-row">
          <input
            ref={inputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleSetPreview}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full lg:w-auto"
            onClick={file ? handleUploadImage : handleClick}
          >
            {file ? 'Save image' : 'Select image'}
          </Button>

          {file && (
            <Button
              type="button"
              variant="ghost"
              className="w-full lg:w-auto"
              onClick={handleRemoveImage}
            >
              Remove image
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
