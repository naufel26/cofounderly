export const PostSkeleton = () => (
    <div className="card-elevated animate-pulse p-4">
        <div className="flex gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 rounded bg-slate-200" />
                <div className="h-3 w-3/4 rounded bg-slate-100" />
            </div>
        </div>
        <div className="mt-6 space-y-3">
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-5/6 rounded bg-slate-100" />
            <div className="h-4 w-4/6 rounded bg-slate-100" />
        </div>
        <div className="mt-6 flex justify-between border-t border-slate-50 pt-4">
            <div className="h-8 w-20 rounded bg-slate-100" />
            <div className="h-8 w-20 rounded bg-slate-100" />
            <div className="h-8 w-20 rounded bg-slate-100" />
        </div>
    </div>
);
