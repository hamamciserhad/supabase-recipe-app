import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { RecipeCard } from '@/components/recipes/RecipeCard'
import { RecipeFilterBar } from '@/components/recipes/RecipeFilterBar'
import { Suspense } from 'react'

export const revalidate = 0 // Opt out of static rendering

export default async function DashboardPage({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const supabase = createClient()
    await supabase.auth.getUser()

    let query = supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

    const searchStr = typeof searchParams.q === 'string' ? searchParams.q : ''
    const categoryStr = typeof searchParams.category === 'string' ? searchParams.category : ''
    const favoritesStr = typeof searchParams.favorites === 'string' ? searchParams.favorites : ''

    if (searchStr) {
        query = query.or(`title.ilike.%${searchStr}%,description.ilike.%${searchStr}%`)
    }

    if (categoryStr && categoryStr !== 'All') {
        query = query.eq('category', categoryStr)
    }

    if (favoritesStr === 'true') {
        query = query.eq('is_favorite', true)
    }

    const { data: recipes } = await query

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-orange-900">Your Recipes</h1>
                    <p className="text-orange-700/80 mt-1">Manage and discover your personal recipe collection</p>
                </div>
                <Link href="/dashboard/recipes/new">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                        <Plus className="h-4 w-4" /> Add Recipe
                    </Button>
                </Link>
            </div>

            <Suspense fallback={<div className="h-10 animate-pulse bg-orange-100 rounded-md mb-8"></div>}>
                <RecipeFilterBar />
            </Suspense>

            {recipes && recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Recipe Cards will go here */}
                    {recipes.map(recipe => (
                        <div key={recipe.id}>
                            <RecipeCard recipe={recipe} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-orange-100 shadow-sm">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 mb-4">
                        <Plus className="h-10 w-10 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-orange-900">No recipes yet</h2>
                    <p className="text-orange-700/70 mb-6 max-w-md mx-auto">
                        Get started by adding your first recipe to your collection. You can add a photo, ingredients, and instructions.
                    </p>
                    <Link href="/dashboard/recipes/new">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                            Create Your First Recipe
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
