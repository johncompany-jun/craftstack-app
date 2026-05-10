import { hc } from 'hono/client'
import type { AppType } from '../../../server/src/index'

const baseUrl = import.meta.env.VITE_API_URL ?? ''

export const client = hc<AppType>(baseUrl)
