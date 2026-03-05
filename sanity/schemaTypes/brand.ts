import { defineField, defineType } from 'sanity'
import { Award } from 'lucide-react'

export default defineType({
    name: 'brand',
    title: 'Brands',
    type: 'document',
    icon: Award,
    fields: [
        defineField({
            name: 'name',
            title: 'Brand Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'logo',
            title: 'Brand Logo',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'website',
            title: 'Official Website',
            type: 'url',
        }),
    ],
})