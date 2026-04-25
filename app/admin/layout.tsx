// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Admin layout — open access for boilerplate demo (no auth gate)
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: app/admin/layout.tsx
// -----------------------------------------------------------

// Auth gate removed. All visitors have full admin access in the boilerplate demo.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
