// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Brain cortex stub — no-op mock client for boilerplate demo (Supabase removed)
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: brain/db/cortex.ts
// -----------------------------------------------------------

function makeQueryChain() {
  const listResult = { data: [] as any[], error: null, count: 0 };
  const singleResult = { data: null as any, error: null };
  const chain: any = {
    then: (resolve: any, reject?: any) => Promise.resolve(listResult).then(resolve, reject),
    single:      () => Promise.resolve(singleResult),
    maybeSingle: () => Promise.resolve(singleResult),
  };
  const m = () => chain;
  ['select','insert','update','upsert','delete','eq','neq','gt','lt','gte','lte',
   'like','ilike','in','not','or','filter','order','range','limit','is','contains',
   'returns',
  ].forEach(k => { chain[k] = m; });
  return chain;
}

export const mockBrainClient = {
  from: (_table: string) => makeQueryChain(),
  auth: {
    getUser:   () => Promise.resolve({ data: { user: null }, error: null }),
    getClaims: () => Promise.resolve({ data: null, error: { message: 'No auth in demo mode' } }),
    admin: {
      listUsers:  () => Promise.resolve({ data: { users: [] }, error: null }),
      createUser: (_opts: any) => Promise.resolve({ data: { user: null }, error: null }),
      deleteUser: (_id: string) => Promise.resolve({ data: {}, error: null }),
    },
  },
  storage: {
    from: (_bucket: string) => ({
      list:         (_path?: string) => Promise.resolve({ data: [], error: null }),
      upload:       (_path: string, _file: any) => Promise.resolve({ data: null, error: null }),
      remove:       (_paths: string[]) => Promise.resolve({ data: null, error: null }),
      getPublicUrl: (_path: string) => ({ data: { publicUrl: '/logo.png' } }),
    }),
  },
} as const;

export async function getDbCortex() {
  return mockBrainClient as any;
}
