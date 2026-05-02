import { Link } from '@inertiajs/react';
import { ArrowRight, Rocket, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
    return (
        <section className="hero-pattern relative flex min-h-screen items-center justify-center overflow-hidden">
            {/* Animated Background Elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="animate-float absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div
                    className="animate-float absolute right-10 bottom-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"
                    style={{ animationDelay: '-3s' }}
                />
                <div className="bg-gradient-radial absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full from-primary/5 to-transparent" />
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Badge */}
                    <div className="animate-slide-up mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                        </span>
                        <span className="text-sm font-medium text-accent-foreground">
                            Bangladesh's Premier Startup Ecosystem
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1
                        className="font-display animate-slide-up mb-6 text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl"
                        style={{ animationDelay: '0.1s' }}
                    >
                        Build the right team{' '}
                        <span className="text-gradient-hero">before</span> you
                        build the product
                    </h1>

                    {/* Subheadline */}
                    <p
                        className="animate-slide-up mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
                        style={{ animationDelay: '0.2s' }}
                    >
                        Connect with founders, investors, advisors, and talent.
                        Form your dream startup team and accelerate your journey
                        from idea to execution.
                    </p>

                    {/* CTA Buttons */}
                    <div
                        className="animate-slide-up mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
                        style={{ animationDelay: '0.3s' }}
                    >
                        <Button variant="hero" size="xl" asChild>
                            <Link href="/signup" className="group">
                                Start Your Journey
                                <ArrowRight className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="xl" asChild>
                            <a href="#how-it-works">See How It Works</a>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div
                        className="animate-slide-up mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3"
                        style={{ animationDelay: '0.4s' }}
                    >
                        <div className="flex flex-col items-center p-4">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-2xl font-bold text-foreground">
                                500+
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Active Founders
                            </span>
                        </div>
                        <div className="flex flex-col items-center p-4">
                            <div className="bg-brand-coral-light mb-3 flex h-12 w-12 items-center justify-center rounded-xl">
                                <Rocket className="h-6 w-6 text-secondary" />
                            </div>
                            <span className="text-2xl font-bold text-foreground">
                                50+
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Teams Formed
                            </span>
                        </div>
                        <div className="flex flex-col items-center p-4">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-2xl font-bold text-foreground">
                                $2M+
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Raised by Members
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>
    );
}
