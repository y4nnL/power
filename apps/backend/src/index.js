import Fastify from 'fastify';
import { pathToFileURL } from 'node:url';

const buildServer = () => {
  const server = Fastify({
    logger: true,
  });

  server.get('/health', async () => ({ status: 'ok' }));

  return server;
};

const start = async () => {
  const server = buildServer();

  try {
    await server.listen({
      port: Number.parseInt(process.env.PORT ?? '3000', 10),
      host: '0.0.0.0',
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

const isMain = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isMain) {
  start();
}

export { buildServer, start };
