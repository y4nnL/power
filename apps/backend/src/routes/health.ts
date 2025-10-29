import type { FastifyPluginAsync } from 'fastify'

type HealthResponse = {
  status: 'ok'
}

const healthResponseSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['ok'] }
  },
  required: ['status'],
  additionalProperties: false
} as const

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.route<{ Reply: HealthResponse }>({
    method: 'GET',
    url: '/health',
    schema: {
      response: {
        200: healthResponseSchema
      }
    },
    handler: async () => ({ status: 'ok' })
  })
}
