import { Link, usePage } from '@inertiajs/react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    // Access authentication data from Inertia shared props
    // To this:
    const { auth } = usePage().props;
    const user = auth?.user; // This will just be 'undefined' instead of crashing.

    return (
        <nav className="border-border/50 bg-background/80 fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-xl">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <Logo size="md" />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden items-center gap-8 md:flex">
                        <a
                            href="#how-it-works"
                            className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                        >
                            How It Works
                        </a>
                        <a
                            href="#who-its-for"
                            className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                        >
                            Who It's For
                        </a>
                        <a
                            href="#features"
                            className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                        >
                            Features
                        </a>
                    </div>

                    {/* Desktop Action Buttons */}
                    {/* Example in your Navbar desktop actions */}
                    <div className="hidden items-center gap-3 md:flex">
                        {auth?.user ? (
                            <Button variant="default" asChild>
                                <Link href="/feeds">Go to Feed</Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" asChild>
                                    <Link href="/login">Sign In</Link>
                                </Button>
                                <Button variant="default" asChild>
                                    <Link href="/signup">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="text-foreground p-2 md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {isOpen && (
                    <div className="animate-fade-in border-border/50 border-t py-4 md:hidden">
                        <div className="flex flex-col gap-4">
                            <a
                                href="#how-it-works"
                                className="px-2 py-2 font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                How It Works
                            </a>
                            <div className="border-border/50 flex flex-col gap-2 border-t pt-4">
                                {auth.user ? (
                                    <Button
                                        variant="default"
                                        className="w-full rounded-xl bg-teal-600"
                                        asChild
                                    >
                                        <Link href="/feeds">Go to Feed</Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="ghost"
                                            asChild
                                            className="w-full"
                                        >
                                            <Link href="/signin">Sign In</Link>
                                        </Button>
                                        <Button
                                            variant="default"
                                            asChild
                                            className="w-full rounded-xl"
                                        >
                                            <Link href="/signup">
                                                Get Started
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
