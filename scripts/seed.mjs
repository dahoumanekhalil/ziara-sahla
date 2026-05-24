import { put } from '@vercel/blob'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is not set.')
  process.exit(1)
}

const offers = readFileSync(join(root, 'data', 'offers.json'), 'utf-8')
const gallery = readFileSync(join(root, 'data', 'gallery.json'), 'utf-8')

await put('data/offers.json', offers, {
  access: 'public',
  addRandomSuffix: false,
  contentType: 'application/json',
  token,
})
console.log('✓ Uploaded offers.json')

await put('data/gallery.json', gallery, {
  access: 'public',
  addRandomSuffix: false,
  contentType: 'application/json',
  token,
})
console.log('✓ Uploaded gallery.json')

console.log('\nVercel Blob seeded successfully.')
