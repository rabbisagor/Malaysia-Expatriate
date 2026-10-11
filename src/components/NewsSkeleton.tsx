import React from 'react';

interface NewsSkeletonProps {
  count?: number;
}

export const NewsSkeleton: React.FC<NewsSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse flex flex-col"
        >
          {/* Image skeleton */}
          <div className="h-48 bg-slate-200 w-full" />
          
          {/* Content skeleton */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-3 bg-slate-200 rounded w-20" />
                <div className="h-3 bg-slate-200 rounded w-16" />
              </div>
              <div className="h-5 bg-slate-200 rounded w-5/6" />
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="space-y-1.5 pt-2">
                <div className="h-3.5 bg-slate-100 rounded w-full" />
                <div className="h-3.5 bg-slate-100 rounded w-4/5" />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-4 bg-slate-100 rounded w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
