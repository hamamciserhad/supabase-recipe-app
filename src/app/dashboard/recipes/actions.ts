'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteRecipe(id: string) {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Get recipe to check ownership and get photo_url
    const { data: recipe, error: fetchError } = await supabase
        .from('recipes')
        .select('user_id, photo_url')
        .eq('id', id)
        .single()

    if (fetchError || !recipe) {
        return { error: 'Recipe not found' }
    }

    if (recipe.user_id !== user.id) {
        return { error: 'Unauthorized' }
    }

    // Delete from database
    const { error: deleteError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)

    if (deleteError) {
        return { error: deleteError.message }
    }

    // Best effort delete photo from storage
    if (recipe.photo_url) {
        // Extract file path from public URL
        // Format: https://[project].supabase.co/storage/v1/object/public/recipe-photos/[userId]/[filename]
        try {
            const urlParts = recipe.photo_url.split('/recipe-photos/')
            if (urlParts.length > 1) {
                const filePath = urlParts[1]
                await supabase.storage.from('recipe-photos').remove([filePath])
            }
        } catch (e) {
            console.error('Failed to delete photo from storage', e)
        }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('recipes')
        .update({ is_favorite: !isFavorite })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath(`/dashboard/recipes/${id}`)
    return { success: true }
}
