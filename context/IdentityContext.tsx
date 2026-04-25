// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Identity context — hardcoded owner for boilerplate demo (no auth)
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: context/IdentityContext.tsx
// -----------------------------------------------------------
'use client'

import React, { createContext, useContext } from 'react'

interface IdentityContextType {
    user: any | null;
    role: 'user' | 'admin' | 'owner' | null;
    loading: boolean;
}

// Demo always runs as the owner — no login required.
const DEMO_IDENTITY: IdentityContextType = {
    user: { id: 'demo-admin', email: 'admin@jaxscollectibles.com' },
    role: 'owner',
    loading: false,
}

const IdentityContext = createContext<IdentityContextType>(DEMO_IDENTITY)

export function IdentityProvider({ children }: { children: React.ReactNode }) {
    return (
        <IdentityContext.Provider value={DEMO_IDENTITY}>
            {children}
        </IdentityContext.Provider>
    )
}

export function useIdentity() {
    return useContext(IdentityContext)
}
