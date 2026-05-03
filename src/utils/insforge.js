import { createClient } from '@insforge/sdk'

const appkey = import.meta.env.VITE_INSFORGE_APPKEY
const region = import.meta.env.VITE_INSFORGE_REGION
const apiKey = import.meta.env.VITE_INSFORGE_API_KEY
const ossHost = import.meta.env.VITE_INSFORGE_OSS_HOST

export const insforge = createClient({
  baseUrl: ossHost,
  anonKey: apiKey,
  appkey,
  region
})
