import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 right-0 left-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center">
                        <Logo size="md" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-8 md:flex">
                        <a
                            href="#how-it-works"
                            className="text-muted-foreground font-medium transition-colors hover:text-foreground"
                        >
                            How It Works
                        </a>
                        <a
                            href="#who-its-for"
                            className="text-muted-foreground font-medium transition-colors hover:text-foreground"
                        >
                            Who It's For
                        </a>
                        <a
                            href="#features"
                            className="text-muted-foreground font-medium transition-colors hover:text-foreground"
                        >
                            Features
                        </a>
                    </div>

                    <div className="hidden items-center gap-3 md:flex">
                        <Button variant="ghost" asChild>
                            <Link to="/signin">Sign In</Link>
                        </Button>
                        <Button variant="default" asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="p-2 text-foreground md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="animate-fade-in border-t border-border/50 py-4 md:hidden">
                        <div className="flex flex-col gap-4">
                            <a
                                href="#how-it-works"
                                className="text-muted-foreground px-2 py-2 font-medium transition-colors hover:text-foreground"
                                onClick={() => setIsOpen(false)}
                            >
                                How It Works
                            </a>
                            <a
                                href="#who-its-for"
                                className="text-muted-foreground px-2 py-2 font-medium transition-colors hover:text-foreground"
                                onClick={() => setIsOpen(false)}
                            >
                                Who It's For
                            </a>
                            <a
                                href="#features"
                                className="text-muted-foreground px-2 py-2 font-medium transition-colors hover:text-foreground"
                                onClick={() => setIsOpen(false)}
                            >
                                Features
                            </a>
                            <div className="flex flex-col gap-2 border-t border-border/50 pt-4">
                                <Button
                                    variant="ghost"
                                    asChild
                                    className="w-full"
                                >
                                    <Link to="/signin">Sign In</Link>
                                </Button>
                                <Button
                                    variant="default"
                                    asChild
                                    className="w-full"
                                >
                                    <Link to="/signup">Get Started</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
