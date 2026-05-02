import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const { auth } = usePage().props as any;

    const navLinks = [
        { label: 'How It Works', href: '#how-it-works' },
        { label: "Who It's For", href: '#who-its-for' },
        { label: 'Features', href: '#features' },
    ];

    return (
        <nav className="border-border/50 bg-background/80 fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-xl">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <Logo size="md" />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Action Buttons */}
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
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {isOpen && (
                    <div className="animate-fade-in border-border/50 border-t py-4 md:hidden">
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-muted-foreground hover:text-foreground rounded-lg px-3 py-2.5 font-medium transition-colors hover:bg-accent"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="border-border/50 mt-2 flex flex-col gap-2 border-t pt-4">
                                {auth?.user ? (
                                    <Button variant="default" className="w-full" asChild>
                                        <Link href="/feeds">Go to Feed</Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button variant="ghost" asChild className="w-full">
                                            <Link href="/login">Sign In</Link>
                                        </Button>
                                        <Button variant="default" asChild className="w-full">
                                            <Link href="/signup">Get Started</Link>
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
