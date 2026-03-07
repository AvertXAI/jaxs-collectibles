import { defineField, defineType } from 'sanity'
import { Truck } from 'lucide-react'

export default defineType({
    name: 'shipping',
    title: 'Shipping Zones',
    type: 'document',
    icon: Truck,
    fields: [
        defineField({ name: 'zoneName', title: 'Zone Name', type: 'string' }), // e.g., "Domestic USA"
        defineField({ name: 'rate', title: 'Flat Rate Price', type: 'number' }),
        defineField({
            name: 'status',
            title: 'Zone Status',
            type: 'string',
            options: { list: ['Active', 'Paused', 'International Only'] }
        }),
    ],
})