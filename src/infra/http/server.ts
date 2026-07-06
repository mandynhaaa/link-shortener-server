import fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from '../../env.js';
import { createShortUrl } from '../../app/functions/create-short-url.js';
import { z } from 'zod';
import { getOriginalUrl } from '../../app/functions/get-original-url.js';
import { listLinks } from '../../app/functions/list-links.js';
import { deleteLink } from '../../app/functions/delete-link.js';
import { exportLinksCsv } from '../../app/functions/export-links-csv.js';

const app = fastify()

await app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
})

app.post('/create-link', async (request, reply) => {
  const createLinkBodySchema = z.object({
    originalUrl: z.string().url('Invalid URL format'),
    code: z.string().min(1, 'Code is required'),
  })

  const result = createLinkBodySchema.safeParse(request.body);
  
  if (!result.success) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: result.error.format(),
    })
  }

  const { originalUrl, code } = result.data;

  try {
    const link = await createShortUrl({ originalUrl, code });
    return reply.status(201).send(link);
  } catch (error: any) {
    return reply.status(400).send({ message: error.message });
  }
});

app.get('/:code', async (request, reply) => {
  const getLinkParamsSchema = z.object({
    code: z.string(),
  })

  const { code } = getLinkParamsSchema.parse(request.params);

  if (code === 'favicon.ico' || code === 'robots.txt') {
    return reply.status(404).send({ message: 'Not found' });
  }

  try {
    const { originalUrl } = await getOriginalUrl({ code });
    return reply.status(200).send({ originalUrl });
  } catch (error: any) {
    return reply.status(404).send({ message: error.message });
  }
});

app.get('/list-links', async (request, reply) => {
  const listLinksQuerySchema = z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(20),
  });

  const { page, limit } = listLinksQuerySchema.parse(request.query);

  try {
    const { links } = await listLinks({ page, limit })
    return reply.status(200).send({ links });
  } catch (error: any) {
    return reply.status(400).send({ message: error.message });
  }
});

app.delete('/:id', async (request, reply) => {
  const deleteLinkParamsSchema = z.object({
    id: z.string(),
  });

  const { id } = deleteLinkParamsSchema.parse(request.params);

  try {
    await deleteLink({ id })
    return reply.status(204).send()
  } catch (error: any) {
    return reply.status(404).send({ message: error.message })
  }
});

app.post('/export', async (request, reply) => {
  try {
    const { downloadUrl } = await exportLinksCsv()
    return reply.status(200).send({ downloadUrl })
  } catch (error: any) {
    return reply.status(500).send({ message: error.message })
  }
});

app
  .listen({
    port: env.PORT,
    host: 'localhost',
  })
  .then(() => {
    console.log(`🚀 HTTP Server running on http://localhost:${env.PORT}`)
  })