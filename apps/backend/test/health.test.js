import supertest from 'supertest'

import { buildServer } from '../src/index.js'

describe('GET /health', () => {
  let server

  beforeAll(async () => {
    server = buildServer()
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('returns an ok status', async () => {
    const response = await supertest(server.server).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok' })
  })
})
