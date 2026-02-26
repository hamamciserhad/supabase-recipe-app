import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signout } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Utensils } from 'lucide-react'

export async function Navbar() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <Utensils className="h-6 w-6 text-orange-600" />
                    <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                        Recipe Saver
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link href="/dashboard">
                                <Button variant="ghost" className="hidden sm:inline-flex text-orange-900 hover:text-orange-600 hover:bg-orange-50">
                                    Dashboard
                                </Button>
                            </Link>
                            <form action={signout}>
                                <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                                    Log out
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" className="text-orange-900 hover:text-orange-600 hover:bg-orange-50">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                                    Sign up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
