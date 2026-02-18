import { Link, Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    title?: string;
}

export default function SimpleLayout({ children, title }: Props) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            {/* Dynamic Page Title */}
            <Head title={title} />

            {/* Navigation Header */}
            <nav className="border-b bg-white shadow-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    <Link href="/" className="text-xl font-bold text-blue-600">
                        MyBrand
                    </Link>
                    <div className="space-x-6">
                        <Link
                            href="/home"
                            className="text-gray-600 hover:text-blue-600"
                        >
                            Home
                        </Link>
                        <Link
                            href="/signin"
                            className="text-gray-600 hover:text-blue-600"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="mx-auto w-full max-w-7xl flex-grow p-6">
                {children}
            </main>

            {/* Simple Footer */}
            <footer className="border-t bg-white p-4 text-center text-sm text-gray-400">
                &copy; 2026 My Laravel App
            </footer>
        </div>
    );
}
