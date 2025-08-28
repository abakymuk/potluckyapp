import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const CartItemSchema = z.object({
  menuItemId: z.string().describe('Reference to menu item'),
  quantity: z.number().int().positive().describe('Quantity of the item'),
  notes: z.string().optional().describe('Special instructions for the item'),
})

export const CartSchema = z.object({
  orgId: z.string().describe('Organization identifier'),
  items: z.array(CartItemSchema).describe('Items in the cart'),
  createdAt: z.string().datetime().describe('Cart creation timestamp'),
  updatedAt: z.string().datetime().describe('Last update timestamp'),
})

// TypeScript types
export type TCartItem = z.infer<typeof CartItemSchema>
export type TCart = z.infer<typeof CartSchema>

// OpenAPI metadata
export const CartItemOpenApi = CartItemSchema.openapi('CartItem', {
  description: 'An item in the shopping cart',
  example: {
    menuItemId: 'item-001',
    quantity: 2,
    notes: 'Extra cheese please',
  },
})

export const CartOpenApi = CartSchema.openapi('Cart', {
  description: 'Shopping cart for an organization',
  example: {
    orgId: 'org-001',
    items: [
      {
        menuItemId: 'item-001',
        quantity: 2,
        notes: 'Extra cheese please',
      },
      {
        menuItemId: 'item-002',
        quantity: 1,
      },
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:35:00Z',
  },
})
