import type { FastifyInstance } from 'fastify'
import { buildServer } from './server.js'
import { resolveServerAddress } from './config/environment.js'

type StartOptions = {
  host?: string
  port?: number
}

export async function startServer(options: StartOptions = {}): Promise<FastifyInstance> {
  const server = buildServer()
  const { port, host } = resolveServerAddress(options)

  try {
    await server.listen({ port, host })
    return server
  } catch (error) {
    server.log.error(error)
    await server.close()
    throw error
  }
}
