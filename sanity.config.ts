'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId} from './sanity/env'
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'


export default defineConfig({
  name: 'default',
  title: 'Jax\'s Vault',
  basePath: '/vault',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  // Add and edit the content schema in the './sanity/schemaTypes' folder

  schema: {
    types: schemaTypes,
  },

  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  // THE CUSTOM THEME TO FIX WHITE LINKS & SOFTEN BURGUNDY
  theme: ({
    /* Main colors */
    '--black': '#1a1a1a',
    '--white': '#fff',
    '--gray': '#666',
    '--focus-color': '#D4AF37', // Gold focus

    /* Navigation / Links */
    '--component-bg': '#FDFBF7',
    '--component-text-color': '#800020', // Burgundy links/text

    /* Branding */
    '--brand-primary': '#800020',
  }) as any,
})
