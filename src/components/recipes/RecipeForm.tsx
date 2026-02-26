'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import * as z from 'zod'
import { ImageUpload } from '@/components/shared/ImageUpload'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Plus, Trash2, Loader2, Save } from 'lucide-react'

const recipeSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().optional(),
    ingredients: z.array(z.object({ value: z.string().min(1, 'Ingredient cannot be empty') }))
        .min(1, 'At least one ingredient is required'),
    instructions: z.string().min(1, 'Instructions are required'),
    prep_time: z.number().min(0, { message: "Prep time cannot be negative" }).optional(),
    cook_time: z.number().min(0, { message: "Cook time cannot be negative" }).optional(),
    servings: z.number().min(1, { message: "Servings must be at least 1" }).optional(),
    category: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks']),
})

type RecipeFormValues = z.infer<typeof recipeSchema>

interface RecipeFormProps {
    userId: string
    initialData?: RecipeFormValues & { id?: string, photo_url?: string }
}

export function RecipeForm({ userId, initialData }: RecipeFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const supabase = createClient()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [photoUrl, setPhotoUrl] = useState<string | undefined>(initialData?.photo_url)

    const form = useForm<RecipeFormValues>({
        resolver: zodResolver(recipeSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            ingredients: initialData?.ingredients?.length
                ? initialData.ingredients.map(i => ({ value: (i as { value?: string }).value || (typeof i === 'string' ? i : '') }))
                : [{ value: '' }],
            instructions: initialData?.instructions || '',
            prep_time: initialData?.prep_time,
            cook_time: initialData?.cook_time,
            servings: initialData?.servings || 1,
            category: initialData?.category || 'Dinner',
        },
    })

    const { fields, append, remove } = useFieldArray({
        name: "ingredients",
        control: form.control,
    })

    async function onSubmit(data: RecipeFormValues) {
        setIsSubmitting(true)

        // Convert ingredients array of objects to array of strings for Supabase JSONB
        const formattedIngredients = data.ingredients.map(i => i.value)

        const recipeData = {
            ...data,
            ingredients: formattedIngredients,
            user_id: userId,
            photo_url: photoUrl,
            updated_at: new Date().toISOString()
        }

        try {
            if (initialData?.id) {
                // Update existing recipe
                const { error } = await supabase
                    .from('recipes')
                    .update(recipeData)
                    .eq('id', initialData.id)

                if (error) throw error

                toast({ title: 'Recipe updated successfully!' })
                router.push(`/dashboard/recipes/${initialData.id}`)
            } else {
                // Create new recipe
                const { data: newRecipe, error } = await supabase
                    .from('recipes')
                    .insert(recipeData)
                    .select()
                    .single()

                if (error) throw error

                toast({ title: 'Recipe created successfully!' })
                router.push(`/dashboard/recipes/${newRecipe.id}`)
            }

            router.refresh()
        } catch (error) {
            const err = error as Error
            toast({
                title: 'Error saving recipe',
                description: err.message,
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => onSubmit(data as RecipeFormValues))} className="space-y-8 max-w-3xl mx-auto">

                <Card>
                    <CardContent className="pt-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-orange-900 mb-4 block">Recipe Photo</h3>
                            <ImageUpload
                                userId={userId}
                                onUpload={setPhotoUrl}
                                defaultImage={photoUrl}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Recipe Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="E.g., Grandma's Lasagna" {...field} className="text-lg py-6" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="A brief description of this recipe..."
                                                className="resize-none"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                {...field}
                                            >
                                                <option value="Breakfast">Breakfast</option>
                                                <option value="Lunch">Lunch</option>
                                                <option value="Dinner">Dinner</option>
                                                <option value="Dessert">Dessert</option>
                                                <option value="Snacks">Snacks</option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="servings"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Servings</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="prep_time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prep Time (minutes)</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="cook_time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cook Time (minutes)</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="h-fit">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-orange-900">Ingredients</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 border-orange-200 text-orange-700 hover:bg-orange-50"
                                    onClick={() => append({ value: "" })}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <FormField
                                        key={field.id}
                                        control={form.control}
                                        name={`ingredients.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-medium text-orange-800">
                                                            {index + 1}
                                                        </div>
                                                        <Input {...field} placeholder="e.g. 2 cups flour" className="flex-1" />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => remove(index)}
                                                            disabled={fields.length === 1}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="h-fit">
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-medium text-orange-900 mb-4">Instructions</h3>
                            <FormField
                                control={form.control}
                                name="instructions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Step 1: Preheat oven..."
                                                className="min-h-[300px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-4 pb-12">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-orange-600 hover:bg-orange-700 text-white min-w-[120px]"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving</>
                        ) : (
                            <><Save className="mr-2 h-4 w-4" /> Save Recipe</>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
