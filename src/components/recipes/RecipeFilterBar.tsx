'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
import { Search, Heart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useDebounce } from '@/hooks/use-debounce'

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks']

export function RecipeFilterBar() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const initialSearch = searchParams.get('q') || ''
    const initialCategory = searchParams.get('category') || 'All'
    const initialFavorites = searchParams.get('favorites') === 'true'

    const [searchQuery, setSearchQuery] = useState(initialSearch)
    const [category, setCategory] = useState(initialCategory)
    const [showFavorites, setShowFavorites] = useState(initialFavorites)

    const debouncedSearch = useDebounce(searchQuery, 300)

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value && value !== 'All') {
                params.set(name, value)
            } else {
                params.delete(name)
            }
            return params.toString()
        },
        [searchParams]
    )

    useEffect(() => {
        router.push(`${pathname}?${createQueryString('q', debouncedSearch)}`)
    }, [debouncedSearch, pathname, router, createQueryString])

    const handleCategoryChange = (val: string) => {
        setCategory(val)
        router.push(`${pathname}?${createQueryString('category', val)}`)
    }

    const toggleFavorites = () => {
        const newVal = !showFavorites
        setShowFavorites(newVal)
        router.push(`${pathname}?${createQueryString('favorites', newVal ? 'true' : '')}`)
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-orange-400">
                    <Search className="h-4 w-4" />
                </div>
                <Input
                    type="text"
                    placeholder="Search by title or ingredient..."
                    className="pl-10 border-orange-200 focus-visible:ring-orange-500 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="w-full sm:w-[200px]">
                <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="border-orange-200 focus:ring-orange-500 bg-white">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button
                variant={showFavorites ? "default" : "outline"}
                onClick={toggleFavorites}
                className={`w-full sm:w-auto ${showFavorites ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'border-orange-200 text-orange-700 hover:bg-orange-50'}`}
            >
                <Heart className={`h-4 w-4 mr-2 ${showFavorites ? 'fill-white' : ''}`} />
                Favorites
            </Button>
        </div>
    )
}
