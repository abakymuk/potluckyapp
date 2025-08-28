import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST() {
  try {
    // Check if feature flag is enabled
    const isOnlineOrderingEnabled = process.env.ONLINE_ORDERING_V1 === 'true'

    if (!isOnlineOrderingEnabled) {
      return NextResponse.json(
        { error: 'Feature not available' },
        { status: 404 }
      )
    }

    // Return 501 Not Implemented for now
    return NextResponse.json(
      { error: 'not_implemented', message: 'Cart validation API not implemented yet' },
      { status: 501 }
    )
  } catch (error) {
    // Log error to console for now (Sentry not available in Edge runtime)
    console.error('Cart validation API error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
