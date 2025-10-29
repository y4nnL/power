import { describe, expect, it, vi } from 'vitest'

const startServerMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))

vi.mock('../src/start.js', () => ({
  startServer: startServerMock
}))

describe('index entrypoint', () => {
  it('invokes startServer on module load', async () => {
    vi.resetModules()

    await import('../src/index.js')

    expect(startServerMock).toHaveBeenCalled()
  })
})
