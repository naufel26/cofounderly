import { Head, usePage } from '@inertiajs/react'; // Inertia helpers
import React from 'react';
import { CenterFeed } from '@/components/feed/CenterFeed';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { TopNavigation } from '@/components/layout/TopNavigation';

// If you have a shared Laravel layout (e.g., AuthenticatedLayout)
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Feeds = () => {
    // Access Laravel shared data (user, flash messages, etc.)
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-background">
            {/* Set the Browser Tab Title */}
            <Head title="Your Feed | Cofounderly" />

            <TopNavigation user={auth.user} />

            {/* Main Layout */}
            <div className="pt-20 pb-8">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex gap-6">
                        {/* Left Sidebar - Hidden on mobile */}
                        <div className="hidden w-64 shrink-0 lg:block">
                            <LeftSidebar user={auth.user} />
                        </div>

                        {/* Center Feed */}
                        <div className="min-w-0 flex-1">
                            <CenterFeed />
                        </div>

                        {/* Right Sidebar - Hidden on tablet and below */}
                        <div className="hidden w-80 shrink-0 xl:block">
                            <RightSidebar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feeds;
