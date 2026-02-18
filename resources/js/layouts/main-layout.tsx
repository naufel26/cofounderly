import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

interface Props {
    children: ReactNode;
    title?: string;
}

export default function MainLayout({ children, title }: Props) {
    return (
        <TooltipProvider>
            {/* Dynamic Browser Tab Title */}
            <Head title={title} />

            <div className="flex min-h-screen flex-col bg-background">
                {/* Main Content Area */}
                <main className="flex-grow">{children}</main>
            </div>

            {/* Toast Notifications (Global) */}
            <Toaster />
            <Sonner />
        </TooltipProvider>
    );
}
