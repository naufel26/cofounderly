import { Link } from '@inertiajs/react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Footer() {
    return (
        <footer className="bg-foreground py-16 text-background">
            <div className="container mx-auto px-4">
                <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div className="md:col-span-1">
                        <div className="mb-4">
                            <Logo variant="light" size="md" />
                        </div>
                        <p className="mb-6 text-sm text-background/60">
                            The starting point of every serious startup journey
                            in Bangladesh.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="text-background/60 transition-colors hover:text-background"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="#"
                                className="text-background/60 transition-colors hover:text-background"
                            >
                                <Twitter size={20} />
                            </a>
                            <a
                                href="#"
                                className="text-background/60 transition-colors hover:text-background"
                            >
                                <Linkedin size={20} />
                            </a>
                            <a
                                href="#"
                                className="text-background/60 transition-colors hover:text-background"
                            >
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold">Platform</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link
                                    to="/signup"
                                    className="text-background/60 transition-colors hover:text-background"
                                >
                                    Get Started
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="#how-it-works"
                                    className="text-background/60 transition-colors hover:text-background"
                                >
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#features"
                                    className="text-background/60 transition-colors hover:text-background"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-background/60 transition-colors hover:text-background"
                                >
                                    Pricing
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold">Resources</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="text-background/60 transition-colors hover:text-background"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-background/60 transition-colors hover:text-background"
                                >
                                    Success Stories
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-background/60 transition-colors hover:text-background"
                                >
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-background/60 transition-colors hover:text-background"
                                >
                                    Community
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="text-background/60 transition-colors hover:text-background"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-background/60 transition-colors hover:text-background"
                                >
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-background/60 transition-colors hover:text-background"
                                >
                                    Cookie Policy
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 sm:flex-row">
                    <p className="text-sm text-background/40">
                        © {new Date().getFullYear()} Cofounderly. All rights
                        reserved.
                    </p>
                    <p className="text-sm text-background/40">
                        Made with ❤️ in Bangladesh
                    </p>
                </div>
            </div>
        </footer>
    );
}
