import { Head, usePage } from '@inertiajs/react'; // Inertia helpers
import React from 'react';
import { ChatOverlay } from '@/components/chat/ChatOverlay';
import { CenterFeed } from '@/components/feed/CenterFeed';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { TopNavigation } from '@/components/layout/TopNavigation';

// If you have a shared Laravel layout (e.g., AuthenticatedLayout)
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Feeds = () => {
    const { suggested_users } = usePage().props as any;

    return (
        <>
            <div className="min-h-screen bg-background">
                <Head title="Your Feed | Cofounderly" />

                <TopNavigation />

                <div className="pt-20 pb-8">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="flex gap-6">
                            <div className="hidden w-64 shrink-0 lg:block">
                                <LeftSidebar />
                            </div>

                            <div className="min-w-0 flex-1">
                                <CenterFeed />
                            </div>

                            <div className="hidden w-80 shrink-0 xl:block">
                                <RightSidebar suggestedUsers={suggested_users ?? []} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ChatOverlay />
        </>
    );
};

export default Feeds;
