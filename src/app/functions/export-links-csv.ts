import { db } from '../../infra/db/index.js'
import { links } from '../../infra/db/schemas/links.js'
import { env } from '../../env.js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { desc } from 'drizzle-orm'
import { format } from 'fast-csv'
import { randomUUID } from 'node:crypto'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
})

interface ExportLinksCsvResponse {
  downloadUrl: string
}

export async function exportLinksCsv(): Promise<ExportLinksCsvResponse> {
  const allLinks = await db.select().from(links).orderBy(desc(links.createdAt))

  const csvSegments: string[] = []
  const csvStream = format({ headers: true, delimiter: ';' })

  csvStream.on('data', (chunk) => csvSegments.push(chunk.toString()))

  for (const link of allLinks) {
    csvStream.write({
      'URL Original': link.originalUrl,
      'URL Encurtada': `http://localhost:3333/${link.code}`,
      'Contagem de Acessos': link.clicks,
      'Data de Criacao': link.createdAt.toString(),
    })
  }
  
  csvStream.end()

  await new Promise((resolve) => csvStream.on('end', resolve))
  const csvBuffer = Buffer.concat(csvSegments.map((s) => Buffer.from(s)))

  const fileName = `${randomUUID()}.csv`

  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET,
      Key: fileName,
      Body: csvBuffer,
      ContentType: 'text/csv',
    })
  )

  return {
    downloadUrl: `${env.CLOUDFLARE_PUBLIC_URL}/${fileName}`,
  }
}