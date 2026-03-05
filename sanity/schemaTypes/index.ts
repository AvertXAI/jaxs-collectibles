import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import category from './category'
import brand from './brand'
// NEW SCHEMAS FOR PHASE 2
import hotDeals from './hotDeals'
import order from './order'
import banner from './banner'
import faq from './faq'

// This is what the Studio actually reads to build your sidebar
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, brand, hotDeals, order, banner, faq],
}

// Keep this for compatibility with your config imports
export const schemaTypes = [product, category, brand, hotDeals, order, banner, faq]