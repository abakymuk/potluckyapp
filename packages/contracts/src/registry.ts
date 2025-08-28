import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import { MenuOpenApi, MenuItemOpenApi } from './schemas/menu'
import { CartOpenApi, CartItemOpenApi } from './schemas/cart'
import { PriceRequestOpenApi, PriceQuoteOpenApi, PriceBreakdownOpenApi } from './schemas/price'

export const registry = new OpenAPIRegistry()

// Register all schemas
registry.register('MenuItem', MenuItemOpenApi)
registry.register('Menu', MenuOpenApi)
registry.register('CartItem', CartItemOpenApi)
registry.register('Cart', CartOpenApi)
registry.register('PriceBreakdown', PriceBreakdownOpenApi)
registry.register('PriceRequest', PriceRequestOpenApi)
registry.register('PriceQuote', PriceQuoteOpenApi)

// Menu endpoints
registry.registerPath({
  method: 'get',
  path: '/api/menu',
  tags: ['menu'],
  summary: 'Get menu for organization',
  description: 'Retrieve the complete menu for a specific organization',
  responses: {
    200: {
      description: 'Menu retrieved successfully',
      content: {
        'application/json': {
          schema: MenuOpenApi,
        },
      },
    },
    404: {
      description: 'Menu not found',
    },
  },
})

// Price endpoints
registry.registerPath({
  method: 'post',
  path: '/api/price',
  tags: ['price'],
  summary: 'Calculate price for items',
  description: 'Calculate total price including tax and fees for cart items',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PriceRequestOpenApi,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Price calculated successfully',
      content: {
        'application/json': {
          schema: PriceQuoteOpenApi,
        },
      },
    },
    400: {
      description: 'Invalid request data',
    },
  },
})

// Cart validation endpoint
registry.registerPath({
  method: 'post',
  path: '/api/cart/validate',
  tags: ['cart'],
  summary: 'Validate cart',
  description: 'Validate cart structure and item availability',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CartOpenApi,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Cart is valid',
      content: {
        'application/json': {
          schema: z.object({
            valid: z.boolean(),
            errors: z.array(z.string()).optional(),
          }),
        },
      },
    },
    400: {
      description: 'Cart validation failed',
    },
  },
})
