import { Sparkles, ExternalLink, TrendingUp, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export const RightSidebar = () => {
    return (
        <aside className="sticky top-20 h-fit w-80 shrink-0 space-y-4">
            {/* 1. Go Premium Card */}
            <div className="card-elevated group relative overflow-hidden p-5">
                <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                    <Sparkles className="text-primary h-12 w-12" />
                </div>
                <div className="mb-3 flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <h4 className="text-foreground font-bold">Go Premium</h4>
                </div>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    Unlock unlimited connections, priority matching, and
                    exclusive advisor access.
                </p>
                <Button className="bg-gradient-hero shadow-primary/20 w-full rounded-xl border-none py-6 font-bold text-white shadow-lg hover:opacity-90">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade Now
                </Button>
            </div>

            {/* 2. Sponsored Advisor Card */}
            <div className="card-elevated p-4">
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-muted-foreground/70 text-[10px] font-bold uppercase tracking-widest">
                        Sponsored
                    </span>
                    <ExternalLink className="text-muted-foreground hover:text-primary h-3 w-3 cursor-pointer" />
                </div>

                <div className="mb-4 flex gap-4">
                    <Avatar className="h-12 w-12 rounded-xl">
                        <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" />
                        <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    <div>
                        <h5 className="text-foreground text-sm font-bold">
                            Michael Scott
                        </h5>
                        <span className="mt-1 inline-block rounded-md bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-600">
                            Advisor
                        </span>
                    </div>
                </div>

                <p className="text-muted-foreground mb-4 text-xs leading-normal">
                    Ex-YC Partner | Helped 50+ startups scale to $10M+ ARR
                </p>

                <Button
                    variant="outline"
                    className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary w-full rounded-xl font-bold"
                >
                    Book a Session
                </Button>
            </div>

            {/* 3. Trending Startups */}
            <div className="card-elevated p-4">
                <div className="mb-4 flex items-center gap-2 px-1">
                    <TrendingUp className="h-4 w-4 text-teal-500" />
                    <h4 className="text-foreground text-sm font-bold">
                        Trending Startups
                    </h4>
                </div>

                <div className="space-y-4">
                    {[
                        {
                            name: 'NeuralFlow AI',
                            tag: 'AI/ML',
                            growth: '+127%',
                        },
                        {
                            name: 'GreenStack',
                            tag: 'CleanTech',
                            growth: '+89%',
                        },
                        { name: 'FinWise', tag: 'FinTech', growth: '+72%' },
                    ].map((startup) => (
                        <div
                            key={startup.name}
                            className="group cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h5 className="text-foreground group-hover:text-primary text-sm font-bold transition-colors">
                                        {startup.name}
                                    </h5>
                                    <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-tighter">
                                        {startup.tag}
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-teal-500">
                                    {startup.growth}
                                </span>
                            </div>
                            <div className="mt-3 h-[1px] w-full bg-slate-100" />
                        </div>
                    ))}
                </div>

                <button className="text-primary mt-4 flex w-full items-center justify-center gap-2 text-xs font-bold transition-all hover:gap-3">
                    View All Startups
                    <ArrowRight className="h-3 w-3" />
                </button>
            </div>

            {/* 4. Footer Links Ad Card */}
            <div className="rounded-2xl border border-teal-100/50 bg-gradient-to-br from-teal-50 to-teal-100/30 p-8 text-center">
                <h5 className="mb-1 font-bold text-teal-800">Your Ad Here</h5>
                <p className="text-xs text-teal-600/80">Reach 50K+ founders</p>
            </div>
        </aside>
    );
};
