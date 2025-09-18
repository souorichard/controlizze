import {
  CreateBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { env } from '@controlizze/env'

const isLocal = env.APP_ENV === 'development'

const s3 = new S3Client({
  region: env.AWS_REGION,
  endpoint: isLocal ? 'http://localhost:4566' : undefined,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: isLocal,
})

export async function uploadAvatar(
  fileBuffer: Buffer,
  key: string,
  contentType: string,
) {
  await s3.send(new CreateBucketCommand({ Bucket: env.AWS_S3_BUCKET }))

  await s3.send(
    new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read',
    }),
  )

  if (isLocal) {
    return `http://localhost:4566/${env.AWS_S3_BUCKET}/${key}`
  }

  return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`
}
