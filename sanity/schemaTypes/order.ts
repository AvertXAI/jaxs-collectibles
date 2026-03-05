import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'order',
    title: 'Orders',
    type: 'document',
    fields: [
        defineField({ name: 'orderNumber', title: 'Order #', type: 'string' }),
        defineField({ name: 'total', title: 'Total Amount', type: 'number' }),
    ],
})