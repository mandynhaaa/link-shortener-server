import { db } from '../../infra/db/index.js'
import { links } from '../../infra/db/schemas/links.js'
import { eq } from 'drizzle-orm'

interface DeleteLinkRequest {
  id: string
}

export async function deleteLink({ id }: DeleteLinkRequest): Promise<void> {
  const result = await db
    .delete(links)
    .where(eq(links.id, id))
    .returning({ id: links.id })

  if (result.length === 0) {
    throw new Error('Link not found')
  }
}