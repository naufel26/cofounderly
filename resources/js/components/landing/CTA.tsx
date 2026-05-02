import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTA() {
    return (
        <section className="relative overflow-hidden py-24">
            {/* Background */}
            <div className="bg-gradient-hero absolute inset-0 opacity-95" />
            <div className="hero-pattern absolute inset-0 opacity-30" />

            <div className="relative z-10 container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="font-display mb-6 text-3xl font-bold text-primary-foreground sm:text-4xl md:text-5xl">
                        Ready to Find Your Perfect Co-Founder?
                    </h2>
                    <p className="mx-auto mb-10 max-w-xl text-lg text-primary-foreground/80">
                        Join hundreds of founders, investors, and talent who are
                        building the future of Bangladesh's startup ecosystem.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button variant="hero-outline" size="xl" asChild>
                            <Link href="/signup" className="group">
                                Create Free Account
                                <ArrowRight className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                    <p className="mt-6 text-sm text-primary-foreground/60">
                        No credit card required · Free forever for basic
                        features
                    </p>
                </div>
            </div>
        </section>
    );
}
