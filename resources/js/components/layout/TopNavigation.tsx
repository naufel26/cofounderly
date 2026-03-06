import { Link, router, usePage } from '@inertiajs/react';
import {
    Search,
    Home,
    MessageSquare,
    Bell,
    ChevronDown,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export const TopNavigation = () => {
    const { auth } = usePage().props as any;
    const user = auth?.user; // The '?' prevents the crash if auth is missing
    const [searchFocused, setSearchFocused] = useState(false);

    return (
        <header className="border-border/60 fixed left-0 right-0 top-0 z-50 border-b bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
                {/* 1. Brand Logo */}
                <Link
                    href="/feeds"
                    className="flex shrink-0 items-center gap-2.5"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2DAB94]">
                        <span className="text-lg font-bold text-white">CF</span>
                    </div>
                    <span className="hidden text-xl font-bold tracking-tight text-[#0F172A] sm:block">
                        CoFounder
                    </span>
                </Link>

                {/* 2. Search Bar - Styled to match screenshot */}
                <div className="max-w-md flex-1 px-4">
                    <div
                        className={`relative transition-all duration-200 ${searchFocused ? 'scale-[1.01]' : ''}`}
                    >
                        <Search className="h-4.5 w-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search founders, startups, ideas, advisors..."
                            className="h-11 w-full rounded-xl border-slate-100 bg-slate-50/50 pl-11 text-sm placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-teal-500/10"
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                    </div>
                </div>

                {/* 3. Action Items */}
                <nav className="flex items-center gap-1.5">
                    {/* Home Icon with Teal Background */}
                    <Link
                        href="/feeds"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F6F4] text-[#2DAB94]"
                    >
                        <Home className="h-5.5 w-5.5" />
                    </Link>

                    {/* Message with Orange Badge */}
                    <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100">
                        <MessageSquare className="h-5.5 w-5.5" />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#F97316] text-[10px] font-bold text-white">
                            2
                        </span>
                    </button>

                    {/* Notifications with Orange Badge */}
                    <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100">
                        <Bell className="h-5.5 w-5.5" />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#F97316] text-[10px] font-bold text-white">
                            3
                        </span>
                    </button>

                    {/* Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="ml-2 flex items-center gap-1 rounded-full p-0.5 transition-all hover:bg-slate-100">
                                <Avatar className="h-9 w-9 ring-2 ring-transparent transition-all group-hover:ring-slate-200">
                                    <AvatarImage src={user.profile_photo_url} />
                                    <AvatarFallback className="bg-slate-200 text-xs font-bold text-slate-600">
                                        {user.name
                                            ?.substring(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            sideOffset={8}
                            className="animate-slide-in w-56 rounded-xl border border-slate-100 bg-white p-2 shadow-xl"
                        >
                            <div className="px-3 py-2">
                                <p className="font-bold text-slate-900">
                                    {user.name}
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                                    {user.role}
                                </p>
                            </div>
                            <DropdownMenuSeparator className="my-1 bg-slate-100" />

                            <DropdownMenuItem
                                onClick={() => router.get('/profile')}
                                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50"
                            >
                                View Profile
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => router.post('logout')}
                                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
                            >
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* 4. Go Premium Button - Styled with specific Purple Gradient */}
                    <button className="ml-3 hidden items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition-all hover:opacity-90 active:scale-95 sm:flex">
                        <Sparkles className="h-4 w-4" />
                        <span>Go Premium</span>
                    </button>
                </nav>
            </div>
        </header>
    );
};
