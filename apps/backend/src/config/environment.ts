import { config as loadEnv } from 'dotenv'
import type { ProcessEnv } from 'node:process'

const DEFAULT_HOST = '0.0.0.0'
const DEFAULT_PORT = 3000

loadEnv()

type ResolveServerAddressOverrides = {
  host?: string
  port?: number
}

type ResolveServerAddressOptions = ResolveServerAddressOverrides & {
  env?: ProcessEnv
}

type ServerAddress = {
  host: string
  port: number
}

const parsePort = (value: string | undefined): number | undefined => {
  if (value === undefined) {
    return undefined
  }

  const parsed = Number.parseInt(value, 10)

  return Number.isNaN(parsed) ? undefined : parsed
}

export const resolveServerAddress = (options: ResolveServerAddressOptions = {}): ServerAddress => {
  const { env, ...overrides } = options
  const sourceEnv = env ?? process.env
  const envPort = parsePort(sourceEnv.PORT)
  const envHost = sourceEnv.HOST

  return {
    port: overrides.port ?? envPort ?? DEFAULT_PORT,
    host: overrides.host ?? envHost ?? DEFAULT_HOST
  }
}
