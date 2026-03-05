import { defineField, defineType } from 'sanity'
import { Package } from 'lucide-react'

export default defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  icon: Package,
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    // --- NEW: THE PRISM STATUS DROPDOWN ---
    defineField({
      name: 'availability',
      title: 'Availability Status',
      type: 'string',
      options: {
        list: [
          { title: 'Available (Lime Green)', value: 'available' },
          { title: 'Low Stock (Orange)', value: 'low-stock' },
          { title: 'Sold Out (Red-Orange)', value: 'sold-out' },
          { title: 'Pre-Order (Teal)', value: 'pre-order' },
          { title: 'Vaulted (Midnight Blue)', value: 'vaulted' },
        ],
      },
      initialValue: 'available',
    }),

    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),

    // --- UPDATED: CATEGORY & BRAND REFERENCES ---
    // These link to your new schemas so the shop can "auto-populate"
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{ type: 'brand' }],
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: 'itemNumber',
      title: 'Item # / SKU',
      type: 'string'
    }),

    // --- MERGED: COA SECTION ---
    defineField({
      name: 'coa',
      title: 'Certificate of Authenticity (COA)',
      type: 'object',
      fields: [
        { name: 'verified', title: 'Verified Status', type: 'boolean', initialValue: true },
        { name: 'id', title: 'Serial Number / COA ID', type: 'string' },
        {
          name: 'authenticator',
          title: 'Authenticated By',
          type: 'string',
          options: {
            list: [
              { title: 'PSA', value: 'psa' },
              { title: 'JSA', value: 'jsa' },
              { title: 'Beckett (BAS)', value: 'beckett' },
              { title: 'Other', value: 'other' },
            ],
          },
        },
      ],
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'notes',
      title: 'Notes (Internal Only)',
      type: 'text'
    }),
  ],
})