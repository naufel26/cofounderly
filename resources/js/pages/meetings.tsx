import { Head, router } from '@inertiajs/react';
import { Calendar, Clock, Plus, Video } from 'lucide-react';
import { ChatOverlay } from '@/components/chat/ChatOverlay';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { TopNavigation } from '@/components/layout/TopNavigation';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function MiniCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = now.getDate();

    const cells: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="mb-3 text-sm font-bold text-slate-800">{monthName}</p>
            <div className="grid grid-cols-7 gap-0.5 text-center">
                {DAYS.map((d) => (
                    <div key={d} className="py-1 text-[10px] font-bold uppercase text-slate-400">
                        {d}
                    </div>
                ))}
                {cells.map((day, i) => (
                    <div
                        key={i}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                            day === today
                                ? 'bg-[#2DAB94] font-bold text-white'
                                : day
                                  ? 'text-slate-700 hover:bg-slate-100 cursor-pointer'
                                  : ''
                        }`}
                    >
                        {day ?? ''}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Meetings() {
    return (
        <>
            <div className="min-h-screen bg-background">
                <Head title="Meetings | Cofounderly" />
                <TopNavigation />

                <div className="pt-20 pb-8">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="flex gap-6">
                            <div className="hidden w-64 shrink-0 lg:block">
                                <LeftSidebar />
                            </div>

                            <div className="min-w-0 flex-1">
                                {/* Header */}
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-extrabold text-slate-900">Meetings</h1>
                                        <p className="mt-0.5 text-sm text-slate-500">
                                            Schedule and manage meetings with advisors & connections
                                        </p>
                                    </div>
                                    <button
                                        disabled
                                        title="Coming soon"
                                        className="flex items-center gap-2 rounded-xl bg-[#2DAB94] px-4 py-2.5 text-sm font-bold text-white opacity-60 cursor-not-allowed"
                                    >
                                        <Plus className="size-4" />
                                        Schedule meeting
                                    </button>
                                </div>

                                <div className="flex gap-6">
                                    {/* Main content */}
                                    <div className="flex-1 space-y-4">
                                        {/* Coming soon card */}
                                        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                                            <div className="bg-gradient-to-r from-[#2DAB94]/10 to-[#F1B981]/10 px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-xl bg-[#2DAB94]/20 p-3">
                                                        <Calendar className="size-6 text-[#2DAB94]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">Advisor meetings, coming soon</p>
                                                        <p className="text-sm text-slate-500">
                                                            Schedule 1-on-1 sessions directly from advisor profiles
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="divide-y divide-slate-50 px-6 py-4">
                                                {[
                                                    {
                                                        icon: <Video className="size-4 text-[#2DAB94]" />,
                                                        title: 'Video & in-person',
                                                        desc: 'Google Meet, Zoom, or meet in Dhaka',
                                                    },
                                                    {
                                                        icon: <Clock className="size-4 text-[#2DAB94]" />,
                                                        title: 'Flexible scheduling',
                                                        desc: 'Choose slots that work for both parties',
                                                    },
                                                    {
                                                        icon: <Calendar className="size-4 text-[#2DAB94]" />,
                                                        title: 'Calendar sync',
                                                        desc: 'Google Calendar integration (coming soon)',
                                                    },
                                                ].map((item) => (
                                                    <div key={item.title} className="flex items-center gap-4 py-3.5">
                                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#E6F6F4]">
                                                            {item.icon}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                                                            <p className="text-xs text-slate-400">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Empty state */}
                                        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white py-14 text-center shadow-sm ring-1 ring-slate-100">
                                            <div className="rounded-2xl bg-slate-100 p-5">
                                                <Calendar className="size-10 text-slate-300" />
                                            </div>
                                            <p className="font-bold text-slate-700">No meetings scheduled</p>
                                            <p className="max-w-xs text-sm text-slate-400">
                                                Connect with advisors to start scheduling meetings and getting expert guidance.
                                            </p>
                                            <button
                                                onClick={() => router.visit('/advisors')}
                                                className="mt-2 rounded-xl bg-[#2DAB94] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#248d7a]"
                                            >
                                                Find an advisor
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mini calendar */}
                                    <div className="hidden w-64 shrink-0 xl:block">
                                        <MiniCalendar />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ChatOverlay />
        </>
    );
}
