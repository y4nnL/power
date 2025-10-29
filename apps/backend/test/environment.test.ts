import type { ProcessEnv } from 'node:process'
import { describe, expect, it } from 'vitest'
import { resolveServerAddress } from '../src/config/environment.js'

describe('resolveServerAddress', () => {
  it('falls back to defaults when no overrides are provided', () => {
    const address = resolveServerAddress({ env: {} as ProcessEnv })

    expect(address).toEqual({ host: '0.0.0.0', port: 3000 })
  })

  it('prefers environment values when overrides are absent', () => {
    const address = resolveServerAddress({
      env: { HOST: '127.0.0.1', PORT: '4000' } satisfies ProcessEnv
    })

    expect(address).toEqual({ host: '127.0.0.1', port: 4000 })
  })

  it('ignores invalid environment ports', () => {
    const address = resolveServerAddress({
      env: { PORT: 'not-a-number' } satisfies ProcessEnv
    })

    expect(address).toEqual({ host: '0.0.0.0', port: 3000 })
  })

  it('allows explicit overrides to win over environment variables', () => {
    const address = resolveServerAddress({
      host: '192.0.2.10',
      port: 8080,
      env: { HOST: '127.0.0.1', PORT: '4000' } satisfies ProcessEnv
    })

    expect(address).toEqual({ host: '192.0.2.10', port: 8080 })
  })
})
