import { db } from '../../infra/db/index.js'
import { links } from '../../infra/db/schemas/links.js'
import { eq, sql } from 'drizzle-orm'

interface GetOriginalUrlRequest {
  code: string
}

interface GetOriginalUrlResponse {
  originalUrl: string
}

export async function getOriginalUrl({
  code,
}: GetOriginalUrlRequest): Promise<GetOriginalUrlResponse> {
  const updatedLinks = await db
    .update(links)
    .set({
      clicks: sql`${links.clicks} + 1`,
    })
    .where(eq(links.code, code))
    .returning({
      originalUrl: links.originalUrl,
    });

  if (updatedLinks.length === 0) {
    throw new Error('Link not found');
  }

  const [updatedLink] = updatedLinks

  if (!updatedLink) {
    throw new Error('Link not found');
  }

  return {
    originalUrl: updatedLink.originalUrl,
  }
}