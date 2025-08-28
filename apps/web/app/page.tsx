import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Potlucky Edge OK</h1>
      <p className="mt-2 text-neutral-600">Next.js 15 + Tailwind + shadcn/ui scaffold</p>
      <div className="mt-6">
        <Button>Get Started</Button>
      </div>
    </main>
  )
}
