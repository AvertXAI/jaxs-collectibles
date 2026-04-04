## Brain Architecture — Server-Side Business Logic

- **Organize server-side business logic in the 'brain/' directory with 'Mechanic' naming convention.** All server-side business logic must live in the 'brain/' directory, organized by domain (brain/cart/, brain/auth/, brain/users/, brain/admin/, brain/products/, brain/owner/, brain/db/). Each business logic module is named with the suffix 'Mechanic' (e.g., syncMechanic.ts, identityMechanic.ts, taxMechanic.ts, uploadMechanic.ts). Database connection factories are named 'cortex': use getDbCortex() for cookie-aware server Supabase clients (regular authenticated operations in server components and actions) and getAdminCortex() for service-role clients (privileged admin operations like seeding and purging). This architecture enforces clean separation between business logic, API routes, and UI components while centralizing database access patterns.
  ```
  // Good
    // brain/cart/syncMechanic.ts
    'use server'
    import { getDbCortex } from '@/brain/db/cortex'
    
    export const syncMechanic = {
      async getCart(userId: string) {
        const supabase = await getDbCortex()
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', userId)
        if (error) throw error
        return data
      }
    }
    
    // brain/admin/seedMechanic.ts - privileged operations
    import { getAdminCortex } from '@/brain/db/adminCortex'
    
    export const seedMechanic = {
      async purgeTestData() {
        const admin = getAdminCortex()
        await admin.from('products').delete().neq('id', '')
      }
    }

  // Bad
    // app/api/cart/route.ts
    // ❌ Business logic directly in API route
    import { createClient } from '@supabase/supabase-js'
    
    export async function GET() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data } = await supabase.from('cart_items').select('*')
      return Response.json(data)
    }
  ```

## Structured Error Handling with BrainError

- **Use BrainError with ErrorSource enum for structured error handling in brain/ modules.** All errors thrown from 'brain/' modules must use the custom BrainError class with an ErrorSource enum category (VALIDATION, DATABASE, STORAGE, AUTH, UNKNOWN). Error sources follow the '\_CORTEX' suffix convention (e.g., 'DATABASE\_CORTEX', 'IDENTITY\_CORTEX'). Error messages use SCREAMING\_SNAKE\_CASE codes. API routes delegate to brain/ modules and follow a consistent try/catch pattern: return { success: true, ...result } on success, and on BrainError extract statusCode and source for structured JSON error responses like { success: false, error, origin }. The logBrainFailure() function from brain/logger.ts handles structured logging of failures.
  ```
  // Good
    export async function POST() {
        try {
            const result = await executeDatabaseSeed();
            return NextResponse.json({ success: true, ...result });
        } catch (error) {
            logBrainFailure(error);
            const status = error instanceof BrainError ? error.statusCode : 500;
            const source = error instanceof BrainError ? error.source : ErrorSource.UNKNOWN;
            return NextResponse.json(
                { success: false, error: error.message, origin: source },
                { status }
            );
        }
    }
    
    // In brain/ module:
    throw new BrainError('CORTEX_CART_FETCH_FAILED', ErrorSource.DATABASE_CORTEX, 500, err);

  // Bad
    export async function POST() {
        const supabase = createClient(...);
        const { data, error } = await supabase.from('products').insert(...);
        if (error) {
            // Unstructured error, no source categorization
            return NextResponse.json({ message: 'failed' }, { status: 500 });
        }
        return NextResponse.json(data);
    }
    
    // In brain/ module:
    throw new Error('Failed to fetch cart');  // Generic error, no structured metadata
  ```

## Context Providers and Hooks

- **Use Context providers in context/ directory with domain-specific naming and useX hooks.** React Contexts live in the top-level 'context/' directory with PascalCase domain names (CartContext.tsx, IdentityContext.tsx). Each file exports a Provider component (CartProvider, IdentityProvider) and a custom hook (useCart, useIdentity). The hook includes a guard that throws if used outside its provider. Contexts are 'use client' components that hydrate from localStorage cache before fetching real data. Auth state specifically should be consumed from IdentityContext via useIdentity() rather than making per-component Supabase auth checks, enabling cache-first rendering with immediate UI paint and background sync.
  ```
  // Good
    // context/IdentityContext.tsx
    'use client'
    const IdentityContext = createContext<IdentityContextType | undefined>(undefined)
    export function IdentityProvider({ children }: ...) { 
      // Hydrate from localStorage first, then sync with Supabase
      ... 
    }
    export function useIdentity() {
        const context = useContext(IdentityContext)
        if (!context) throw new Error("useIdentity must be used within an IdentityProvider")
        return context
    }
    
    // app/admin/layout.tsx
    const { user, role, loading } = useIdentity()
    useEffect(() => {
        if (!loading) {
            if (!user) router.push('/auth')
            else if (role !== 'admin' && role !== 'owner') router.push('/')
        }
    }, [user, role, loading, router])

  // Bad
    // components/auth-check.tsx - each component checks auth independently
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role === 'admin') setAuthorized(true)
    
    // No custom hook - consumers use useContext directly
    export const CartContext = createContext(null)
    // In consumer: const cart = useContext(CartContext) // no runtime guard
  ```

## Copyright Header

- **Every .ts/.tsx file must have the copyright header block.** Every TypeScript file in the project starts with a standardized copyright header using a specific format: a line of slashes, the author line, copyright year, optional file path, and a closing line of slashes. This applies to all files in brain/, lib/, app/, components/, and context/ directories.
  ```
  // Good
    //////////////////////////////////////////////////
    // Author: Jason Cruz
    // Copyright © 2026
    // File: brain/users/profileMechanic.ts
    //////////////////////////////////////////////////

  // Bad
    // profileMechanic.ts
    'use server'
    import ...
  ```

## Page Component Naming

- **Page components use domain-descriptive function names, not generic 'Page'.** Default exported page components use descriptive, domain-specific names rather than generic 'Page'. Examples: StorefrontHome, SearchVault, AdminDashboard, AdminInventoryControl, CustomerIntelligence, AssetCloserPage, ShopDirectory, CheckoutPage, FAQManager. This makes the component tree more readable in React DevTools.
  ```
  // Good
    export default function AdminInventoryControl() { ... }
    export default function AssetCloserPage() { ... }
    export default function StorefrontHome() { ... }

  // Bad
    export default function Page() { ... }
  ```
