import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'banner',
    title: 'Banner',
    type: 'document',
    fields: [
        defineField({ name: 'text', title: 'Banner Text', type: 'string' }),
    ],
})