import { config as loadEnv } from 'dotenv'

const DEFAULT_HOST = '0.0.0.0'
const DEFAULT_PORT = 3000

loadEnv()

type ResolveServerAddressOptions = {
  host?: string
  port?: number
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
  const envPort = parsePort(process.env.PORT)
  const envHost = process.env.HOST

  return {
    port: options.port ?? envPort ?? DEFAULT_PORT,
    host: options.host ?? envHost ?? DEFAULT_HOST
  }
}
