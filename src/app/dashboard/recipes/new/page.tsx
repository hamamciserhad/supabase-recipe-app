import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { RecipeForm } from '@/components/recipes/RecipeForm'

export default async function AddRecipePage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-3xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-orange-900">Add New Recipe</h1>
                <p className="text-orange-700/80 mt-2">
                    Fill in the details below to add a new recipe to your collection.
                </p>
            </div>

            <RecipeForm userId={user.id} />
        </div>
    )
}
