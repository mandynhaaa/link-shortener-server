import { db } from '../../infra/db/index.js'
import { links } from '../../infra/db/schemas/links.js'
import { eq } from 'drizzle-orm'

interface CreateShortUrlRequest {
  originalUrl: string
  code: string
}

interface CreateShortUrlResponse {
  id: string
  code: string
  originalUrl: string
  createdAt: Date
}

export async function createShortUrl({
  originalUrl,
  code,
}: CreateShortUrlRequest): Promise<CreateShortUrlResponse> {
  try {
    new URL(originalUrl);
  } catch {
    throw new Error('Invalid URL format');
  }

  const validCodeRegex = /^[a-z0-9-_]+$/;
  if (!validCodeRegex.test(code)) {
    throw new Error('Invalid shortened URL format. Use only lowercase letters, numbers, hyphens or underscores without spaces.');
  }

  const existingCode = await db
    .select()
    .from(links)
    .where(eq(links.code, code))
    .limit(1);

  if (existingCode[0]) {
    throw new Error('This shortened code is already in use');
  }

  const result = await db.insert(links).values({
    originalUrl,
    code,
  }).returning();

  const item = result[0];

  if (!item) {
    throw new Error('Failed to create link entry in database');
  }

  return {
    id: item.id,
    code: item.code,
    originalUrl: item.originalUrl,
    createdAt: item.createdAt,
  }
}