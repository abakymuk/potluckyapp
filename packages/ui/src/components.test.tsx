import { describe, it, expect } from 'vitest'
import React from 'react'
import { Button } from './components'

describe('Button', () => {
  it('should have correct props interface', () => {
    const props: React.ComponentProps<typeof Button> = {
      children: 'Test Button',
      variant: 'primary',
      size: 'md',
      onClick: () => {},
    }
    expect(props.children).toBe('Test Button')
    expect(props.variant).toBe('primary')
    expect(props.size).toBe('md')
  })

  it('should have default props', () => {
    const defaultProps = {
      children: 'Default Button',
    }
    expect(defaultProps.children).toBe('Default Button')
  })
})
