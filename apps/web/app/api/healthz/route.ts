export const runtime = 'edge'

export async function GET() {
  return new Response(JSON.stringify({ ok: true, runtime: 'edge' }), {
    headers: { 'content-type': 'application/json' },
    status: 200,
  })
}
