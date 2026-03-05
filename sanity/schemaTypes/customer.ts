import { defineField, defineType } from 'sanity'
import { Users } from 'lucide-react'

export default defineType({
    name: 'customer',
    title: 'Customer Directory',
    type: 'document',
    icon: Users,
    fields: [
        defineField({ name: 'fullName', title: 'Full Name', type: 'string' }),
        defineField({ name: 'email', title: 'Email Address', type: 'string' }),
        defineField({ name: 'totalOrders', title: 'Total Orders', type: 'number', initialValue: 0 }),
        defineField({
            name: 'tier',
            title: 'Customer Tier',
            type: 'string',
            options: { list: ['New', 'Regular', 'VIP Collector'] }
        }),
    ],
})