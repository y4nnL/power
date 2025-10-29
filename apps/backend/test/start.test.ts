import { beforeEach, describe, expect, it, vi } from 'vitest'

const buildServerMock = vi.hoisted(() => vi.fn())

vi.mock('../src/server.js', () => ({
  buildServer: buildServerMock
}))

describe('startServer', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.resetAllMocks()
  })

  it('starts the server using the resolved address', async () => {
    const listen = vi.fn().mockResolvedValue(undefined)
    const close = vi.fn().mockResolvedValue(undefined)
    const log = { error: vi.fn() }

    buildServerMock.mockReturnValue({ listen, close, log })

    const { startServer } = await import('../src/start.js')
    const server = await startServer({ host: '127.0.0.1', port: 5050 })

    expect(listen).toHaveBeenCalledWith({ host: '127.0.0.1', port: 5050 })
    expect(server).toEqual(expect.objectContaining({ listen }))
    expect(log.error).not.toHaveBeenCalled()
    expect(close).not.toHaveBeenCalled()
  })

  it('logs the error, closes the server, and rethrows on listen failure', async () => {
    const error = new Error('listen failed')
    const listen = vi.fn().mockRejectedValue(error)
    const close = vi.fn().mockResolvedValue(undefined)
    const log = { error: vi.fn() }

    buildServerMock.mockReturnValue({ listen, close, log })

    const { startServer } = await import('../src/start.js')

    await expect(startServer()).rejects.toThrow(error)
    expect(log.error).toHaveBeenCalledWith(error)
    expect(close).toHaveBeenCalled()
  })
})
