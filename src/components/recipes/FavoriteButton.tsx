'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleFavorite } from '@/app/dashboard/recipes/actions'
import { useToast } from '@/hooks/use-toast'

interface FavoriteButtonProps {
    recipeId: string
    initialIsFavorite: boolean
    className?: string
}

export function FavoriteButton({ recipeId, initialIsFavorite, className }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // Optimistic update
        setIsFavorite(!isFavorite)
        setIsLoading(true)

        try {
            const result = await toggleFavorite(recipeId, isFavorite)
            if (result?.error) {
                // Revert on error
                setIsFavorite(isFavorite)
                toast({
                    title: "Action Failed",
                    description: result.error,
                    variant: "destructive"
                })
            }
        } catch {
            // Revert on error
            setIsFavorite(isFavorite)
            toast({
                title: "Action Failed",
                description: "Failed to update favorite status",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            disabled={isLoading}
            className={`rounded-full hover:bg-orange-100 transition-colors ${className || ''}`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
            <Heart
                className={`h-5 w-5 transition-all duration-300 ${isFavorite
                    ? 'fill-orange-500 text-orange-500 scale-110'
                    : 'text-orange-400 hover:text-orange-500'
                    }`}
            />
        </Button>
    )
}
