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
    '--gray-base': '#666',
    '--background': '#FDFBF7',
    '--focus-color': '#D4AF37', // Gold focus

    /* Navigation / Links */
    '--component-bg': '#FDFBF7',
    '--component-text-color': '#800020', // Burgundy links/text
    '--default-button-primary-color': '#800020',
    '--default-button-success-color': '#059669',
    '--default-button-danger-color': '#dc2626',
    '--state-success-color': '#059669',
    '--state-warning-color': '#eab308',
    '--state-danger-color': '#dc2626',
    '--state-info-color': '#3182ce',


    /* Branding */
    '--brand-primary': '#800020',
    '--main-navigation-color': '#1a1a1a',
    '--main-navigation-color--inverted': '#FDFBF7',
    '--main-navigation-color--opaque': 'rgba(255, 255, 255, 0.7)',

  }) as any,
})
