import { http, HttpResponse } from 'msw'
import { MenuSchema, CartSchema, PriceRequestSchema, PriceQuoteSchema } from '@potlucky/contracts'

// Mock data
const mockMenu = {
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
    {
      id: 'item-003',
      name: 'Chocolate Cake',
      priceCents: 600,
      currency: 'USD',
      tags: ['dessert', 'sweet'],
      isAvailable: true,
      description: 'Rich chocolate cake with vanilla ice cream',
      category: 'Desserts',
    },
  ],
  lastUpdated: new Date().toISOString(),
}

export const handlers = [
  // GET /api/menu
  http.get('/api/menu', () => {
    const result = MenuSchema.safeParse(mockMenu)
    if (!result.success) {
      return HttpResponse.json(
        { error: 'Invalid menu data', details: result.error },
        { status: 500 }
      )
    }
    return HttpResponse.json(result.data)
  }),

  // POST /api/price
  http.post('/api/price', async ({ request }) => {
    try {
      const body = await request.json()

      // Validate request
      const requestResult = PriceRequestSchema.safeParse(body)
      if (!requestResult.success) {
        return HttpResponse.json(
          { error: 'Invalid request', details: requestResult.error },
          { status: 400 }
        )
      }

      // Calculate mock price
      const { items, currency } = requestResult.data
      const subtotalCents = items.reduce((sum: number, item) => {
        const menuItem = mockMenu.items.find(mi => mi.id === item.menuItemId)
        return sum + (menuItem?.priceCents || 0) * item.quantity
      }, 0)

      const taxCents = Math.round(subtotalCents * 0.1) // 10% tax
      const feesCents = Math.round(subtotalCents * 0.05) // 5% fees
      const totalCents = subtotalCents + taxCents + feesCents

      const priceQuote = {
        currency,
        breakdown: {
          subtotalCents,
          taxCents,
          feesCents,
          totalCents,
        },
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        quoteId: `quote-${Date.now()}`,
      }

      // Validate response
      const responseResult = PriceQuoteSchema.safeParse(priceQuote)
      if (!responseResult.success) {
        return HttpResponse.json(
          { error: 'Invalid response data', details: responseResult.error },
          { status: 500 }
        )
      }

      return HttpResponse.json(responseResult.data)
    } catch {
      return HttpResponse.json(
        { error: 'Failed to process request' },
        { status: 500 }
      )
    }
  }),

  // POST /api/cart/validate
  http.post('/api/cart/validate', async ({ request }) => {
    try {
      const body = await request.json()

      // Validate cart
      const cartResult = CartSchema.safeParse(body)
      if (!cartResult.success) {
        return HttpResponse.json({
          valid: false,
          errors: cartResult.error.issues.map((e: { message: string }) => e.message),
        })
      }

      // Check if all items exist in menu
      const cart = cartResult.data
      const errors: string[] = []

      for (const item of cart.items) {
        const menuItem = mockMenu.items.find((mi: { id: string }) => mi.id === item.menuItemId)
        if (!menuItem) {
          errors.push(`Menu item ${item.menuItemId} not found`)
        } else if (!menuItem.isAvailable) {
          errors.push(`Menu item ${item.menuItemId} is not available`)
        }
      }

      return HttpResponse.json({
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
      })
    } catch {
      return HttpResponse.json(
        { error: 'Failed to validate cart' },
        { status: 500 }
      )
    }
  }),
]
