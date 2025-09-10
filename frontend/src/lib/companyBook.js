// Simple IPFS-backed company book using Web3.Storage
// Data shape: { entries: Record<string, string>, updatedAt: string }
// Keys are normalized company names (trimmed, lowercase)

import { Web3Storage } from 'web3.storage'

export function normalizeName(name) {
  return (name || '').trim().toLowerCase()
}

export function getW3Client(token) {
  if (!token) return null
  return new Web3Storage({ token })
}

export async function fetchBookByCid(cid) {
  if (!cid) return { entries: {}, updatedAt: new Date().toISOString() }
  const url = `https://w3s.link/ipfs/${cid}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch book: ${res.status}`)
  const data = await res.json()
  if (!data || typeof data !== 'object') return { entries: {}, updatedAt: new Date().toISOString() }
  return {
    entries: data.entries || {},
    updatedAt: data.updatedAt || new Date().toISOString(),
  }
}

export function resolveName(book, name) {
  const key = normalizeName(name)
  return book?.entries?.[key]
}

export function upsertEntry(book, name, address) {
  const key = normalizeName(name)
  if (!key) throw new Error('Empty name')
  const next = {
    entries: { ...(book?.entries || {}), [key]: address },
    updatedAt: new Date().toISOString(),
  }
  return next
}

export async function putBook(client, book) {
  if (!client) throw new Error('No Web3.Storage client')
  const blob = new Blob([JSON.stringify(book, null, 2)], { type: 'application/json' })
  const file = new File([blob], 'company-book.json', { type: 'application/json' })
  const cid = await client.put([file], { wrapWithDirectory: false })
  return cid
}
