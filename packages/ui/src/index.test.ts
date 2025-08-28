import { describe, it, expect } from 'vitest'
import { uiReady } from './index'

describe('ui', () => {
  it('should be ready', () => {
    expect(uiReady()).toBe(true)
  })
})
