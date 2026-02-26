import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { Clock, Users, ArrowLeft, Edit, ChefHat } from 'lucide-react'
import { DeleteRecipeButton } from '@/components/recipes/DeleteRecipeButton'
import { FavoriteButton } from '@/components/recipes/FavoriteButton'

export const revalidate = 0 // Opt out of static rendering

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: recipe, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !recipe) {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <h1 className="text-2xl font-bold text-orange-900 mb-4">Recipe not found</h1>
                <p className="text-orange-700/80 mb-8">The recipe you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
                <Link href="/dashboard">
                    <Button className="bg-orange-600 hover:bg-orange-700">Back to Dashboard</Button>
                </Link>
            </div>
        )
    }

    const prepTime = recipe.prep_time || 0
    const cookTime = recipe.cook_time || 0
    const totalTime = prepTime + cookTime

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <Link href="/dashboard" className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-6 font-medium">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to recipes
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                    <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg border border-orange-100">
                        {recipe.photo_url ? (
                            <Image
                                src={recipe.photo_url}
                                alt={recipe.title}
                                fill
                                className="object-cover"
                                unoptimized
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 bg-orange-50 flex items-center justify-center">
                                <ChefHat className="h-24 w-24 text-orange-200" />
                            </div>
                        )}

                        <div className="absolute top-4 left-4 z-10 bg-white/90 rounded-full backdrop-blur-sm shadow-sm">
                            <FavoriteButton recipeId={recipe.id} initialIsFavorite={recipe.is_favorite || false} className="h-10 w-10" />
                        </div>

                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-orange-800 shadow-sm">
                            {recipe.category}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-4">
                        <h1 className="text-4xl font-bold text-orange-900 leading-tight">
                            {recipe.title}
                        </h1>
                        <div className="hidden sm:flex items-center gap-2 shrink-0">
                            <Link href={`/dashboard/recipes/${recipe.id}/edit`}>
                                <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                            </Link>
                            <DeleteRecipeButton recipeId={recipe.id} />
                        </div>
                    </div>

                    {recipe.description && (
                        <p className="text-lg text-orange-800/80 mb-8 leading-relaxed">
                            {recipe.description}
                        </p>
                    )}

                    <div className="grid grid-cols-3 gap-4 mb-10 p-6 bg-orange-50 rounded-2xl border border-orange-100">
                        <div className="flex flex-col items-center text-center">
                            <Clock className="h-6 w-6 text-orange-500 mb-2" />
                            <span className="text-sm font-medium text-orange-900">Total Time</span>
                            <span className="text-sm text-orange-700/80">{totalTime} mins</span>
                        </div>
                        <div className="flex flex-col items-center text-center border-x border-orange-200/60">
                            <ChefHat className="h-6 w-6 text-orange-500 mb-2" />
                            <span className="text-sm font-medium text-orange-900">Prep / Cook</span>
                            <span className="text-sm text-orange-700/80">{prepTime}m / {cookTime}m</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <Users className="h-6 w-6 text-orange-500 mb-2" />
                            <span className="text-sm font-medium text-orange-900">Servings</span>
                            <span className="text-sm text-orange-700/80">{recipe.servings || '-'}</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-orange-900 mb-4 pb-2 border-b border-orange-100">
                                Ingredients
                            </h2>
                            <ul className="space-y-3">
                                {Array.isArray(recipe.ingredients) && recipe.ingredients.map((ingredient: string, index: number) => (
                                    <li key={index} className="flex items-start">
                                        <span className="h-2 w-2 rounded-full bg-orange-400 mt-2 mr-3 shrink-0" />
                                        <span className="text-orange-900/90 leading-relaxed">{ingredient}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-orange-900 mb-4 pb-2 border-b border-orange-100">
                                Instructions
                            </h2>
                            <div className="prose prose-orange max-w-none text-orange-900/90 leading-relaxed whitespace-pre-wrap">
                                {recipe.instructions}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-orange-100 sm:hidden flex flex-col gap-3">
                        <Link href={`/dashboard/recipes/${recipe.id}/edit`} className="w-full">
                            <Button variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50">
                                <Edit className="h-4 w-4 mr-2" /> Edit Recipe
                            </Button>
                        </Link>
                        <div className="w-full child:!w-full [&>button]:!w-full">
                            <DeleteRecipeButton recipeId={recipe.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
