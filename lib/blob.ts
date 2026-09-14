import { put as blobPut, list as blobList } from '@vercel/blob'

// Support both the default env var name (BLOB_READ_WRITE_TOKEN) and the
// project-scoped one Vercel generated for this Blob store (ZIARA_READ_WRITE_TOKEN).
export const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ?? process.env.ZIARA_READ_WRITE_TOKEN

export const USE_BLOB = !!BLOB_TOKEN

type PutBody = Parameters<typeof blobPut>[1]
type PutOptions = Parameters<typeof blobPut>[2]
type ListOptions = Parameters<typeof blobList>[0]

export function put(pathname: string, body: PutBody, options: PutOptions) {
  return blobPut(pathname, body, { ...options, token: BLOB_TOKEN })
}

export function list(options: ListOptions = {}) {
  return blobList({ ...options, token: BLOB_TOKEN })
}
