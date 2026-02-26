import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Utensils, BookOpen, Star, Search, ClipboardList } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Save Your Recipes',
    description: 'Keep all your favourite recipes in one place, organised and easy to find.',
  },
  {
    icon: Star,
    title: 'Mark Favourites',
    description: "Star the dishes you love most so they're always just one click away.",
  },
  {
    icon: Search,
    title: 'Search & Filter',
    description: 'Find any recipe instantly by name, category, or cooking time.',
  },
  {
    icon: ClipboardList,
    title: 'Full Recipe Details',
    description: 'Store ingredients, steps, cook times, and serving sizes all in one card.',
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-orange-50 to-white">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Utensils className="h-4 w-4" />
          Your kitchen, organised
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-orange-900 max-w-3xl leading-tight">
          Your Personal{' '}
          <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Recipe Collection
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-stone-600 max-w-xl">
          Save, organise, and rediscover every recipe you love — from quick weeknight dinners to
          weekend showstoppers. Never lose a great dish again.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login">
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 text-base shadow-md shadow-orange-200"
            >
              Sign Up Free
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-orange-200 text-orange-700 hover:bg-orange-50 px-8 text-base"
            >
              Log In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-orange-900 mb-12">
            Everything you need to cook with confidence
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 p-6 rounded-2xl border border-orange-100 bg-orange-50/40 hover:bg-orange-50 transition-colors"
              >
                <feature.icon className="h-7 w-7 shrink-0 text-orange-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to start cooking smarter?</h2>
        <p className="text-orange-100 mb-8 max-w-md mx-auto">
          Join Recipe Saver and build your personal cookbook today — it's completely free.
        </p>
        <Link href="/login">
          <Button
            size="lg"
            className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 text-base shadow"
          >
            Get Started for Free
          </Button>
        </Link>
      </section>
    </div>
  )
}
