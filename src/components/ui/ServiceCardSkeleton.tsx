// src/components/ui/ServiceCardSkeleton.tsx

export const ServiceCardSkeleton = () => (
    <div className="bg-white/5 dark:bg-slate-800/50 p-6 rounded-xl animate-pulse space-y-4">
        <div className="flex items-center justify-between">
            <div className="h-12 w-12 bg-slate-700/50 rounded-lg"></div>
            <div className="h-4 w-8 bg-slate-700/50 rounded"></div>
        </div>
        <div className="space-y-2">
            <div className="h-5 bg-slate-700/50 rounded w-1/2"></div>
            <div className="h-3 bg-slate-700/50 rounded w-full"></div>
        </div>
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <div className="h-6 bg-slate-700/50 rounded w-16"></div>
                <div className="h-3 bg-slate-700/50 rounded w-24"></div>
            </div>
            <div className="space-y-1 text-right">
                <div className="h-4 bg-slate-700/50 rounded w-12"></div>
                <div className="h-3 bg-slate-700/50 rounded w-20"></div>
            </div>
        </div>
        <div className="pt-4 mt-4 border-t border-slate-700/50">
            <div className="h-3 bg-slate-700/50 rounded w-1/4"></div>
        </div>
    </div>
);