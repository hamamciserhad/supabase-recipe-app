'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [action, setAction] = useState<'login' | 'signup'>('login')
    const { toast } = useToast()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)

        try {
            const result = action === 'login'
                ? await login(formData)
                : await signup(formData)

            if (result?.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: 'destructive'
                })
            }
        } catch {
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-orange-50/30">
            <Card className="w-full max-w-sm">
                <form onSubmit={onSubmit}>
                    <CardHeader>
                        <CardTitle className="text-2xl text-orange-900">Welcome back</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your recipe collection
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                className="focus-visible:ring-orange-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="focus-visible:ring-orange-500"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button
                            type="submit"
                            onClick={() => setAction('login')}
                            disabled={isLoading}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            {isLoading && action === 'login' ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <Button
                            type="submit"
                            variant="outline"
                            onClick={() => setAction('signup')}
                            disabled={isLoading}
                            className="w-full border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                        >
                            {isLoading && action === 'signup' ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
