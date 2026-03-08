import { getDbCortex } from '../db/cortex';
import { BrainError, ErrorSource } from '../errors';

export async function fetchCustomerIntelligence(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    sortBy: string = 'created_at',
    sortOrder: 'asc' | 'desc' = 'desc'
) {
    const supabase = await getDbCortex();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new BrainError("Unauthorized", ErrorSource.AUTH, 401);

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin' && profile?.role !== 'owner') throw new BrainError("Clearance Denied", ErrorSource.AUTH, 403);

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // 1. INIT QUERY
    let query = supabase.from('profiles').select('*', { count: 'exact' });

    // 2. SEARCH CORTEX
    if (search) {
        // Strip everything except numbers to easily match phone formatting anomalies
        const numericSearch = search.replace(/\D/g, '');

        let orString = `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`;
        if (numericSearch.length > 0) {
            orString += `,phone.ilike.%${numericSearch}%`;
        }
        query = query.or(orString);
    }

    // 3. SORT CORTEX
    // Map UI dropdown values to actual database columns
    let dbColumn = 'created_at';
    if (sortBy === 'First Name') dbColumn = 'first_name';
    if (sortBy === 'Last Name') dbColumn = 'last_name';
    if (sortBy === 'Phone Number') dbColumn = 'phone';

    query = query.order(dbColumn, { ascending: sortOrder === 'asc' });

    // 4. PAGINATION
    query = query.range(start, end);

    const { data: customers, error, count } = await query;

    if (error) throw new BrainError("Failed to fetch customer data", ErrorSource.DATABASE, 500, error);

    const formattedCustomers = customers?.map((c: any) => ({
        id: c.id,
        email: c.email,
        firstName: c.first_name || "Unknown",
        lastName: c.last_name || "User",
        phone: c.phone || "No Number Provided",
        joined: c.created_at,
        lastLogin: new Date().toISOString(), // Auth table holds actual last login, mocked here for UI speed
        role: c.role,
        paymentData: "Visa ending in 4242",
        cartStatus: "Active Items"
    })) || [];

    return {
        customers: formattedCustomers,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / limit) || 1,
        currentPage: page
    };
}