import React from 'react';

export const ErrorState = ({ error }) => {
    return (
        <div className="p-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <h3 className="font-semibold">Failed to load products</h3>
                <p className="text-sm">{error?.message || 'An unexpected error occurred'}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        </div>
    );
};
