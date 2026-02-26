import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { RecipeForm } from '@/components/recipes/RecipeForm'

export default async function EditRecipePage({ params }: { params: { id: string } }) {
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
        redirect('/dashboard')
    }

    // Ensure user can only edit their own recipes
    if (recipe.user_id !== user.id) {
        redirect('/dashboard')
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-3xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-orange-900">Edit Recipe</h1>
                <p className="text-orange-700/80 mt-2">
                    Update the details of your recipe below.
                </p>
            </div>

            <RecipeForm userId={user.id} initialData={recipe} />
        </div>
    )
}
