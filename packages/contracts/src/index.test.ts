import { describe, it, expect } from 'vitest'
import { contractsReady } from './index'

describe('contracts', () => {
  it('should be ready', () => {
    expect(contractsReady()).toBe(true)
  })
})
