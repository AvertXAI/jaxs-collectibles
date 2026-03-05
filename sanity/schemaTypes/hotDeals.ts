import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'hotDeals',
    title: 'Hot Deals',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Deal Title',
            type: 'string' }),
        defineField({
            name: 'discount',
            title: 'Discount %',
            type: 'number'
        }),
    ],
})