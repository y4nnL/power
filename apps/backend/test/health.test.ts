import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { buildServer } from '../src/server.js'

describe('health route', () => {
  it('responds with service status', async () => {
    const app = buildServer()
    await app.ready()

    const response = await request(app.server).get('/health')

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ status: 'ok' })

    await app.close()
  })
})
