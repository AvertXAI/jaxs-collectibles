import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // This is already set correctly in your file:
  useCdn: false,
  // ADD THIS: Ensures the client always fetches fresh data when we need it
  perspective: 'published',
})

// HELPER: Use this for the Admin side to bypass all caching
export const adminClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN, // You'll need this for Edit/Delete logic later
  perspective: 'previewDrafts', // Allows admins to see drafts before they go live
})