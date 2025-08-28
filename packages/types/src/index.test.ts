import { describe, it, expect } from 'vitest'
import type { BrandId } from './index'

describe('types', () => {
  it('should have BrandId type', () => {
    // Type check only - BrandId is a branded type
    const brandId: BrandId = 'test' as BrandId
    expect(typeof brandId).toBe('string')
  })
})
