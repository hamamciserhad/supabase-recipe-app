'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteRecipe } from '@/app/dashboard/recipes/actions'
import { useToast } from '@/hooks/use-toast'

export function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const { toast } = useToast()

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteRecipe(recipeId)
            if (result?.error) {
                toast({
                    title: "Delete Failed",
                    description: result.error,
                    variant: "destructive"
                })
                setIsDeleting(false)
            }
        } catch {
            toast({
                title: "Delete Failed",
                description: "An unexpected error occurred.",
                variant: "destructive"
            })
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 shrink-0">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your recipe
                        and remove the picture from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {isDeleting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</>
                        ) : (
                            'Delete Recipe'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
