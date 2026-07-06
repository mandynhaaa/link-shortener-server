import { db } from '../../infra/db/index.js'
import { links } from '../../infra/db/schemas/links.js'
import { eq } from 'drizzle-orm'
import { randomBytes } from 'node:crypto'

interface CreateShortUrlRequest {
  originalUrl: string
}

interface CreateShortUrlResponse {
  code: string
  originalUrl: string
}

export async function createShortUrl({
  originalUrl,
}: CreateShortUrlRequest): Promise<CreateShortUrlResponse> {
  try {
    new URL(originalUrl);
  } catch {
    throw new Error('Invalid URL format');
  }

  let code: string
  code = randomBytes(3).toString('hex');
  const existingLink = await db
    .select()
    .from(links)
    .where(eq(links.originalUrl, originalUrl))
    .limit(1);

  if (existingLink[0]) {
    return {
      code: existingLink[0].code,
      originalUrl,
    }
  }

  await db.insert(links).values({
    originalUrl,
    code: code!,
  });

  return {
    code: code!,
    originalUrl,
  }
}