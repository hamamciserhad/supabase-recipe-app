'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ImagePlus, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'

interface ImageUploadProps {
    userId: string
    onUpload: (url: string) => void
    defaultImage?: string
}

export function ImageUpload({ userId, onUpload, defaultImage }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()
    const supabase = createClient()

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                return
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${userId}/${Math.random()}.${fileExt}`

            setIsUploading(true)

            // Setup preview
            const objectUrl = URL.createObjectURL(file)
            setPreviewUrl(objectUrl)

            const { error: uploadError } = await supabase.storage
                .from('recipe-photos')
                .upload(filePath, file, { upsert: true })

            if (uploadError) {
                throw uploadError
            }

            const { data: { publicUrl } } = supabase.storage
                .from('recipe-photos')
                .getPublicUrl(filePath)

            onUpload(publicUrl)

        } catch (error) {
            const err = error as Error
            toast({
                title: "Upload failed",
                description: err.message,
                variant: "destructive"
            })
            setPreviewUrl(defaultImage || null)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div
                className="relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/50 hover:bg-orange-50 transition-colors overflow-hidden group"
                onClick={() => fileInputRef.current?.click()}
            >
                {previewUrl ? (
                    <>
                        <Image
                            src={previewUrl}
                            alt="Recipe preview"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-medium flex items-center gap-2">
                                <ImagePlus className="h-5 w-5" /> Change Photo
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-orange-600/60 group-hover:text-orange-600 transition-colors">
                        <ImagePlus className="h-10 w-10 mb-2 mt-4" />
                        <p className="text-sm font-medium">Click to upload photo</p>
                        <p className="text-xs mt-1">JPEG, PNG up to 5MB</p>
                    </div>
                )}

                {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                        <Loader2 className="h-8 w-8 text-orange-600 animate-spin" />
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    )
}
