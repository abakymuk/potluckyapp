import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET as getMenu } from '../app/api/menu/route'
import { POST as postPrice } from '../app/api/price/route'
import { POST as postCartValidate } from '../app/api/cart/validate/route'

describe('API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('/api/menu', () => {
    it('should return 404 when ONLINE_ORDERING_V1 is disabled', async () => {
      // Mock environment variable
      const originalEnv = process.env.ONLINE_ORDERING_V1
      process.env.ONLINE_ORDERING_V1 = 'false'

      const response = await getMenu()

      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data.error).toBe('Feature not available')

      // Restore environment
      process.env.ONLINE_ORDERING_V1 = originalEnv
    })

    it('should return 501 when ONLINE_ORDERING_V1 is enabled', async () => {
      // Mock environment variable
      const originalEnv = process.env.ONLINE_ORDERING_V1
      process.env.ONLINE_ORDERING_V1 = 'true'

      const response = await getMenu()

      expect(response.status).toBe(501)
      const data = await response.json()
      expect(data.error).toBe('not_implemented')

      // Restore environment
      process.env.ONLINE_ORDERING_V1 = originalEnv
    })
  })

  describe('/api/price', () => {
    it('should return 404 when ONLINE_ORDERING_V1 is disabled', async () => {
      // Mock environment variable
      const originalEnv = process.env.ONLINE_ORDERING_V1
      process.env.ONLINE_ORDERING_V1 = 'false'

      const response = await postPrice()

      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data.error).toBe('Feature not available')

      // Restore environment
      process.env.ONLINE_ORDERING_V1 = originalEnv
    })

    it('should return 501 when ONLINE_ORDERING_V1 is enabled', async () => {
      // Mock environment variable
      const originalEnv = process.env.ONLINE_ORDERING_V1
      process.env.ONLINE_ORDERING_V1 = 'true'

      const response = await postPrice()

      expect(response.status).toBe(501)
      const data = await response.json()
      expect(data.error).toBe('not_implemented')

      // Restore environment
      process.env.ONLINE_ORDERING_V1 = originalEnv
    })
  })

  describe('/api/cart/validate', () => {
    it('should return 404 when ONLINE_ORDERING_V1 is disabled', async () => {
      // Mock environment variable
      const originalEnv = process.env.ONLINE_ORDERING_V1
      process.env.ONLINE_ORDERING_V1 = 'false'

      const response = await postCartValidate()

      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data.error).toBe('Feature not available')

      // Restore environment
      process.env.ONLINE_ORDERING_V1 = originalEnv
    })

    it('should return 501 when ONLINE_ORDERING_V1 is enabled', async () => {
      // Mock environment variable
      const originalEnv = process.env.ONLINE_ORDERING_V1
      process.env.ONLINE_ORDERING_V1 = 'true'

      const response = await postCartValidate()

      expect(response.status).toBe(501)
      const data = await response.json()
      expect(data.error).toBe('not_implemented')

      // Restore environment
      process.env.ONLINE_ORDERING_V1 = originalEnv
    })
  })
})
