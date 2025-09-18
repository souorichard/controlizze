import { randomBytes } from 'node:crypto'

import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { NotFoundError } from '@/http/routes/_errors/not-found-error'
import { prisma } from '@/lib/prisma'
import { uploadAvatar } from '@/lib/storage/s3'
import { createSlug } from '@/utils/create-slug'

import { BadRequestError } from '../../_errors/bad-request-error'

export async function uploadOrganizationAvatar(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/upload-avatar',
      {
        schema: {
          tags: ['Storage'],
          summary: 'Upload organization avatar.',
          consumes: ['multipart/form-data'],
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              url: z.url(),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params

        const file = await request.file()

        if (!file) {
          throw new BadRequestError('No file uploaded.')
        }

        const organization = await prisma.organization.findUnique({
          where: {
            slug,
          },
        })

        if (!organization) {
          throw new NotFoundError('Organization not found.')
        }

        const allowedTypes = ['image/png', 'image/jpg']

        if (!allowedTypes.includes(file.mimetype)) {
          throw new BadRequestError(
            'Invalid file type. Only PNG and JPG are allowed.',
          )
        }

        if (file.file.truncated) {
          throw new BadRequestError(`File size should not be larger than 5MB.`)
        }

        const buffer = await file.toBuffer()

        const hash = randomBytes(4).toString('hex')
        const formattedFilename = file.filename
          .replace(/(png|jpg|jpeg|gif)$/i, '')
          .toLowerCase()

        const key = `avatars/${slug}/${createSlug(formattedFilename)}-${hash}`

        const url = await uploadAvatar(buffer, key, file.mimetype)

        return {
          url,
        }
      },
    )
}
