import { db } from '../../infra/db/index.js'
import { links } from '../../infra/db/schemas/links.js'
import { desc } from 'drizzle-orm'

interface ListLinksRequest {
  page?: number
  limit?: number
}

interface LinkItem {
  id: string
  originalUrl: string
  code: string
  clicks: number
  createdAt: Date
}

interface ListLinksResponse {
  links: LinkItem[]
}

export async function listLinks({
  page = 1,
  limit = 20,
}: ListLinksRequest): Promise<ListLinksResponse> {
  const offset = (page - 1) * limit

  const result = await db
    .select()
    .from(links)
    .orderBy(desc(links.createdAt))
    .limit(limit)
    .offset(offset)

  return {
    links: result,
  }
}