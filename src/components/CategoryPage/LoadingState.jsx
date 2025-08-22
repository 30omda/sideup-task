import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingState = () => {
    return (
        <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(8).fill().map((_, index) => (
                    <div key={index} className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-8 w-24 mt-4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
