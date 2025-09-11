'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import { Button } from '@/components/ui/button'

export const profileAvatarSchema = z.object({
  avatar: z
    .custom<File>((value) => value instanceof File, 'Select an image.')
    .refine((file) => file.size <= 2 * 1024 * 1024, 'Maximum size: 2MB.')
    .refine(
      (file) => ['image/png', 'image/jpeg'].includes(file.type),
      'Invalid format (PNG ou JPG).',
    ),
})

export function ProfileAvatarForm() {
  const inputRef = useRef<HTMLInputElement>(null)

  const [preview, setPreview] = useState<string | null>(null)

  function handleClick() {
    inputRef.current?.click()
  }

  function handleUploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      toast.error('Select an image.')
      return
    }

    const response = profileAvatarSchema.safeParse({ avatar: file })

    if (!response.success) {
      toast.error(response.error.issues[0].message)
      return
    }

    const url = URL.createObjectURL(file)

    setPreview(url)
  }

  function handleRemoveImage() {
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
          <div className="size-14 rounded-full border" />
        )}

        <div className="flex flex-col items-center gap-2 lg:flex-row">
          <input
            ref={inputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleUploadImage}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full lg:w-auto"
            onClick={handleClick}
          >
            Select image
          </Button>

          {preview && (
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
