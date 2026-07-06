import { db } from '../../infra/db/index.js'
import { links } from '../../infra/db/schemas/links.js'
import { eq } from 'drizzle-orm'

interface DeleteLinkRequest {
  code: string
}

export async function deleteLink({ code }: DeleteLinkRequest): Promise<void> {
  const result = await db
    .delete(links)
    .where(eq(links.code, code))
    .returning({ id: links.id })

  if (result.length === 0) {
    throw new Error('Link not found')
  }
}