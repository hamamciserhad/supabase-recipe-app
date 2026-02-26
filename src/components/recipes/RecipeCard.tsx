import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, ChefHat } from 'lucide-react'
import { FavoriteButton } from './FavoriteButton'

import { Database } from '@/types/database.types'

type Recipe = Database['public']['Tables']['recipes']['Row']

interface RecipeCardProps {
    recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0)

    return (
        <Link href={`/dashboard/recipes/${recipe.id}`}>
            <Card className="group overflow-hidden border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white h-full flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-orange-50">
                    <div className="absolute top-2 left-2 z-10 bg-white/80 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FavoriteButton
                            recipeId={recipe.id}
                            initialIsFavorite={recipe.is_favorite || false}
                        />
                    </div>
                    {recipe.photo_url ? (
                        <Image
                            src={recipe.photo_url}
                            alt={recipe.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ChefHat className="h-12 w-12 text-orange-200" />
                        </div>
                    )}

                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-orange-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {recipe.category}
                    </div>
                </div>

                <CardContent className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-orange-950 text-lg line-clamp-1 group-hover:text-orange-700 transition-colors">
                            {recipe.title}
                        </h3>
                    </div>

                    <p className="text-sm text-orange-800/70 line-clamp-2 mb-4 flex-1">
                        {recipe.description || "No description provided."}
                    </p>

                    <div className="flex items-center text-xs text-orange-700/80 font-medium">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {totalTime > 0 ? `${totalTime} mins` : '-'}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
