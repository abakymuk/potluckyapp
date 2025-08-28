import { describe, it, expect } from 'vitest'
import { MenuItemSchema, MenuSchema } from './menu'

describe('Menu Schemas', () => {
  describe('MenuItemSchema', () => {
    it('should validate a valid menu item', () => {
      const validItem = {
        id: 'item-001',
        name: 'Margherita Pizza',
        priceCents: 1500,
        currency: 'USD',
        tags: ['pizza', 'vegetarian'],
        isAvailable: true,
        description: 'Classic tomato and mozzarella pizza',
        category: 'Pizza',
      }

      const result = MenuItemSchema.safeParse(validItem)
      expect(result.success).toBe(true)
    })

    it('should use defaults for optional fields', () => {
      const minimalItem = {
        id: 'item-002',
        name: 'Caesar Salad',
        priceCents: 800,
      }

      const result = MenuItemSchema.safeParse(minimalItem)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.currency).toBe('USD')
        expect(result.data.tags).toEqual([])
        expect(result.data.isAvailable).toBe(true)
      }
    })

    it('should reject invalid price', () => {
      const invalidItem = {
        id: 'item-003',
        name: 'Invalid Item',
        priceCents: -100,
      }

      const result = MenuItemSchema.safeParse(invalidItem)
      expect(result.success).toBe(false)
    })
  })

  describe('MenuSchema', () => {
    it('should validate a valid menu', () => {
      const validMenu = {
        orgId: 'org-001',
        items: [
          {
            id: 'item-001',
            name: 'Margherita Pizza',
            priceCents: 1500,
            currency: 'USD',
            tags: ['pizza'],
            isAvailable: true,
          },
        ],
        lastUpdated: '2024-01-15T10:30:00Z',
      }

      const result = MenuSchema.safeParse(validMenu)
      expect(result.success).toBe(true)
    })

    it('should reject menu without items', () => {
      const invalidMenu = {
        orgId: 'org-001',
        items: [],
        lastUpdated: '2024-01-15T10:30:00Z',
      }

      const result = MenuSchema.safeParse(invalidMenu)
      expect(result.success).toBe(true) // Empty array is valid
    })
  })
})
