import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const MenuItemSchema = z.object({
  id: z.string().describe('Unique menu item identifier'),
  name: z.string().min(1).describe('Display name of the menu item'),
  priceCents: z.number().int().positive().describe('Price in cents'),
  currency: z.enum(['USD', 'EUR', 'RUB']).default('USD').describe('Currency code'),
  tags: z.array(z.string()).default([]).describe('Tags for categorization'),
  isAvailable: z.boolean().default(true).describe('Whether the item is available for ordering'),
  description: z.string().optional().describe('Optional description'),
  imageUrl: z.string().url().optional().describe('Optional image URL'),
  category: z.string().optional().describe('Menu category'),
})

export const MenuSchema = z.object({
  orgId: z.string().describe('Organization identifier'),
  items: z.array(MenuItemSchema).describe('List of menu items'),
  lastUpdated: z.string().datetime().describe('Last update timestamp'),
})

// TypeScript types
export type TMenuItem = z.infer<typeof MenuItemSchema>
export type TMenu = z.infer<typeof MenuSchema>

// OpenAPI metadata
export const MenuItemOpenApi = MenuItemSchema.openapi('MenuItem', {
  description: 'A menu item with pricing and availability information',
  example: {
    id: 'item-001',
    name: 'Margherita Pizza',
    priceCents: 1500,
    currency: 'USD',
    tags: ['pizza', 'vegetarian'],
    isAvailable: true,
    description: 'Classic tomato and mozzarella pizza',
    category: 'Pizza',
  },
})

export const MenuOpenApi = MenuSchema.openapi('Menu', {
  description: 'Complete menu for an organization',
  example: {
    orgId: 'org-001',
    items: [
      {
        id: 'item-001',
        name: 'Margherita Pizza',
        priceCents: 1500,
        currency: 'USD',
        tags: ['pizza', 'vegetarian'],
        isAvailable: true,
        description: 'Classic tomato and mozzarella pizza',
        category: 'Pizza',
      },
      {
        id: 'item-002',
        name: 'Caesar Salad',
        priceCents: 800,
        currency: 'USD',
        tags: ['salad', 'healthy'],
        isAvailable: true,
        description: 'Fresh romaine lettuce with Caesar dressing',
        category: 'Salads',
      },
    ],
    lastUpdated: '2024-01-15T10:30:00Z',
  },
})
