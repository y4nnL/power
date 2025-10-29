import type { FastifyPluginCallback } from 'fastify'

type HealthResponse = {
  status: 'ok'
}

export const healthRoutes: FastifyPluginCallback = (app, _options, done) => {
  app.route<{ Reply: HealthResponse }>({
    method: 'GET',
    url: '/health',
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' }
          },
          required: ['status'],
          additionalProperties: false
        }
      }
    },
    handler: async () => ({ status: 'ok' })
  })

  done()
}
