import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';
import { HomeIcon, LogIn, LogOut, Sprout } from 'lucide-react';
import { ModeToggle } from './modetoggle';
import { stackServerApp } from '@/stack';
// import { getUserDetails } from '@/actions/user.action';
import { UserButton } from '@stackframe/stack';


async function Navbar() {
    const user = await stackServerApp.getUser();
    const app = stackServerApp.urls;
    // const userProfile = await getUserDetails(user?.id);
    return (
        <nav className="max-w-7xl mx-auto px-4 *:sm:px-6 lg:px-8 border-b">
            <div className="flex items-center h-16 justify-between">
                {/*Logo */}
                <div className="flex items-center">
                    <Link
                        href="/"
                        className="text-xl font-bold font-mono tracking-wider"
                    >
                        🌱 Plantventory
                    </Link>
                </div>

                {/*Navbar components*/}
                {/* {userProfile?.name && <span>Hello {userProfile.name.split(' ')[0].trim()}</span>} */}
                <div className="hidden md:flex items-center space-x-4">
                    <Button variant="ghost" className="flex items-center gap-2" asChild>
                        <Link href="/plants">
                            <Sprout className="w-4 h-4" />
                            <span className="hidden lg:inline">Plants</span>
                        </Link>
                    </Button>

                    <Button variant="ghost" className="flex items-center gap-2" asChild>
                        <Link href="/">
                            <HomeIcon className="w-4 h-4" />
                            <span className="hidden lg:inline">Home</span>
                        </Link>
                    </Button>

                    <ModeToggle />

                    {user ? (
                        <>
                            {/*Sign out Button*/}
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                                asChild
                            >
                                <Link href={app.signOut}>
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden lg:inline">Sign Out</span>
                                </Link>
                            </Button>

                            <UserButton />

                        </>
                    ) : (
                        <>
                            {/*Sign Button*/}
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2"
                                asChild
                            >
                                <Link href={app.signIn}>
                                    <LogIn className="w-4 h-4" />
                                    <span className="hidden lg:inline">Sign In</span>
                                </Link>
                            </Button>   
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar