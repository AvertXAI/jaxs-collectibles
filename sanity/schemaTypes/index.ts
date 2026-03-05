import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import category from './category'
import brand from './brand'
import hotDeals from './hotDeals'
import order from './order'
import banner from './banner'
import faq from './faq'

// This is what the Studio actually reads to build your sidebar
export const schema: { types: SchemaTypeDefinition[] } = {
// IMPORTANT: Make sure every imported schema is listed here exactly once
  types: [
    product,
    category,
    brand,
    hotDeals,
    order,
    banner,
    faq
  ],
}

// This is the array your sanity.config.ts uses
export const schemaTypes = [
  product,
  category,
  brand,
  hotDeals,
  order,
  banner,
  faq
]