import { FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

import { BadRequestError } from './routes/_errors/bad-request-error'
import { ConflictError } from './routes/_errors/conflict-error'
import { ForbiddenError } from './routes/_errors/forbidden-error'
import { NotFoundError } from './routes/_errors/not-found-error'
import { UnauthorizedError } from './routes/_errors/unauthorized-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  // if (error instanceof ZodError) {
  //   return reply.status(400).send({
  //     message: 'Validation error.',
  //     issues: error.flatten().fieldErrors,
  //   })
  // }

  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      statusCode: 400,
      message: 'Validation error',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  if (error instanceof NotFoundError) {
    return reply.status(404).send({ message: error.message })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({ message: error.message })
  }

  if (error instanceof ForbiddenError) {
    return reply.status(403).send({ message: error.message })
  }

  console.error(error)

  // TODO: send error to some observalibity plataform

  return reply.status(500).send({ message: 'Internal server error.' })
}
