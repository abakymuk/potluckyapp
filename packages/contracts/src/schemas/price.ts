import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const PriceBreakdownSchema = z.object({
  subtotalCents: z.number().int().nonnegative().describe('Subtotal in cents'),
  taxCents: z.number().int().nonnegative().describe('Tax amount in cents'),
  feesCents: z.number().int().nonnegative().describe('Service fees in cents'),
  totalCents: z.number().int().positive().describe('Total amount in cents'),
})

export const PriceRequestSchema = z.object({
  orgId: z.string().describe('Organization identifier'),
  items: z.array(z.object({
    menuItemId: z.string().describe('Menu item identifier'),
    quantity: z.number().int().positive().describe('Quantity'),
  })).describe('Items to price'),
  currency: z.enum(['USD', 'EUR', 'RUB']).default('USD').describe('Currency for pricing'),
})

export const PriceQuoteSchema = z.object({
  currency: z.enum(['USD', 'EUR', 'RUB']).describe('Currency of the quote'),
  breakdown: PriceBreakdownSchema.describe('Price breakdown'),
  expiresAt: z.string().datetime().describe('Quote expiration timestamp'),
  quoteId: z.string().describe('Unique quote identifier'),
})

// TypeScript types
export type TPriceBreakdown = z.infer<typeof PriceBreakdownSchema>
export type TPriceRequest = z.infer<typeof PriceRequestSchema>
export type TPriceQuote = z.infer<typeof PriceQuoteSchema>

// OpenAPI metadata
export const PriceBreakdownOpenApi = PriceBreakdownSchema.openapi('PriceBreakdown', {
  description: 'Detailed price breakdown',
  example: {
    subtotalCents: 3000,
    taxCents: 300,
    feesCents: 200,
    totalCents: 3500,
  },
})

export const PriceRequestOpenApi = PriceRequestSchema.openapi('PriceRequest', {
  description: 'Request for price calculation',
  example: {
    orgId: 'org-001',
    items: [
      {
        menuItemId: 'item-001',
        quantity: 2,
      },
      {
        menuItemId: 'item-002',
        quantity: 1,
      },
    ],
    currency: 'USD',
  },
})

export const PriceQuoteOpenApi = PriceQuoteSchema.openapi('PriceQuote', {
  description: 'Price quote with breakdown and expiration',
  example: {
    currency: 'USD',
    breakdown: {
      subtotalCents: 3000,
      taxCents: 300,
      feesCents: 200,
      totalCents: 3500,
    },
    expiresAt: '2024-01-15T11:30:00Z',
    quoteId: 'quote-001',
  },
})
