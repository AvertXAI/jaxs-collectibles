// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Supabase provider — mock stub for boilerplate demo (no real Supabase)
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: components/supabase-provider.tsx
// -----------------------------------------------------------

// This file exists only to preserve compatibility with components that still import
// useSupabase() before they are fully rewired to the JSON data layer in Phase 3.
// The mock client returns empty data for all queries so pages don't crash.
'use client'

import { createContext, useContext } from 'react'

// Builds a chainable query object that resolves to empty data when awaited.
// Covers the builder-pattern calls: .from().select().eq().order().range() etc.
function makeQuery() {
  const result = { data: [] as any[], error: null, count: 0 }

  const chain: any = {
    then: (resolve: (v: any) => any, reject?: (e: any) => any) =>
      Promise.resolve(result).then(resolve, reject),
    catch: (reject: (e: any) => any) => Promise.resolve(result).catch(reject),
    // terminal methods that return their own Promise
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
  }

  // Every other builder method returns the same chain for further chaining.
  const chainMethod = () => chain
  ;[
    'select', 'insert', 'update', 'upsert', 'delete',
    'eq', 'neq', 'gt', 'lt', 'gte', 'lte',
    'like', 'ilike', 'in', 'not', 'or', 'filter',
    'order', 'range', 'limit',
  ].forEach((key) => { chain[key] = chainMethod })

  return chain
}

const mockSupabase = {
  from: (_table: string) => makeQuery(),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: (_cb: any) => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  },
  storage: {
    from: (_bucket: string) => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: (_path: string) => ({ data: { publicUrl: '' } }),
    }),
  },
}

const SupabaseContext = createContext<any>(mockSupabase)

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // Provider is kept in the tree for gradual migration; supplies the mock client.
  return (
    <SupabaseContext.Provider value={mockSupabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => useContext(SupabaseContext)
