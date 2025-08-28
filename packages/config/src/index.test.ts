import { describe, it, expect } from 'vitest'
import { flags } from './index'

describe('config', () => {
  it('should have feature flags', () => {
    expect(flags.ONLINE_ORDERING_V1).toBe(false)
    expect(flags.ORDER_QUEUE_V1).toBe(false)
    expect(flags.AI_ADVISOR_V1).toBe(false)
  })
})
