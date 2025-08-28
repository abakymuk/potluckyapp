import { describe, it, expect } from 'vitest'
import { PublicEnvSchema } from '../src/schema'

describe('config/public env', () => {
  it('fails without required NEXT_PUBLIC_*', () => {
    const result = PublicEnvSchema.safeParse({
      NEXT_PUBLIC_SUPABASE_URL: undefined,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('NEXT_PUBLIC_SUPABASE_URL'))).toBe(true)
      expect(result.error.issues.some(i => i.path.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY'))).toBe(true)
    }
  })

  it('parses flags booleans correctly', () => {
    const result = PublicEnvSchema.safeParse({
      NEXT_PUBLIC_SUPABASE_URL: 'https://wnqzzplxfoutblsksvud.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InducXp6cGx4Zm91dGJsc2tzdnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNTI2OTUsImV4cCI6MjA3MTkyODY5NX0.xKBvnarYHs3qAV1ug5HVNBdfiERMOGv23gCZWYfvFtk',
      ONLINE_ORDERING_V1: 'true',
      ORDER_QUEUE_V1: '0',
      AI_ADVISOR_V1: 'yes'
    })
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.ONLINE_ORDERING_V1).toBe(true)
      expect(result.data.ORDER_QUEUE_V1).toBe(false)
      expect(result.data.AI_ADVISOR_V1).toBe(true)
    }
  })
})
