import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'category',
      title: 'Collectible Category',
      type: 'string',
      options: {
        list: [
          { title: 'Cards', value: 'cards' },
          { title: 'Comics', value: 'comics' },
          { title: 'Figures', value: 'figures' },
          { title: 'Memorabilia', value: 'memorabilia' },
          { title: 'TV Shows', value: 'tv-shows' },
          { title: 'Movies', value: 'movies' },
          { title: 'Sports', value: 'sports' },
        ],
      },
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: 'itemNumber',
      title: 'Item #',
      type: 'string'
    }),
    defineField({
      name: 'coa',
      title: 'Certificate of Authenticity (COA)',
      type: 'object',
      fields: [
        { name: 'id', title: 'COA ID / Serial Number', type: 'string' },
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
        { name: 'verified', title: 'Verified Status', type: 'boolean', initialValue: true },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'notes',
      title: 'Notes (Internal)',
      type: 'text'
    }),
  ],
})