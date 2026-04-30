import type { FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'
import { env } from '../env.ts'
import { BadRequestError } from './errors/bad-request-error.ts'
import { ConflictError } from './errors/conflict-error.ts'
import { ForbiddenError } from './errors/forbidden-error.ts'
import { NotFoundError } from './errors/not-found-error.ts'
import { UnauthorizedError } from './errors/unauthorized-error.ts'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      statusCode: 400,
      message: 'Validation error',
      // biome-ignore lint/suspicious/noExplicitAny: Zod/Fastify validation error shape is dynamic and not fully typed here
      errors: error.validation.map((err: any) => ({
        path: err.params?.issue?.path ?? [],
        message: err.message,
      })),
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({ message: error.message })
  }

  if (error instanceof ConflictError) {
    return reply.status(409).send({ message: error.message })
  }

  if (error instanceof ForbiddenError) {
    return reply.status(403).send({ message: error.message })
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({ message: error.message })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({ message: error.message })
  }

  if (env.NODE_ENV !== 'production') {
    console.log(error)
  }

  // TODO: send error to some observalibity plataform

  return reply.status(500).send({ message: 'Internal server error' })
}
