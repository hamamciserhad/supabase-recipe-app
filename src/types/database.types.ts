export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            recipes: {
                Row: {
                    category: string
                    cook_time: number | null
                    created_at: string | null
                    description: string | null
                    id: string
                    ingredients: string[] | null
                    instructions: string
                    is_favorite: boolean | null
                    photo_url: string | null
                    prep_time: number | null
                    servings: number | null
                    title: string
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    category: string
                    cook_time?: number | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    ingredients?: string[] | null
                    instructions: string
                    is_favorite?: boolean | null
                    photo_url?: string | null
                    prep_time?: number | null
                    servings?: number | null
                    title: string
                    updated_at?: string | null
                    user_id?: string
                }
                Update: {
                    category?: string
                    cook_time?: number | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    ingredients?: string[] | null
                    instructions?: string
                    is_favorite?: boolean | null
                    photo_url?: string | null
                    prep_time?: number | null
                    servings?: number | null
                    title?: string
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "recipes_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
