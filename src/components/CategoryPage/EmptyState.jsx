import React from 'react';

export const EmptyState = ({ categoryName }) => {
    return (
        <div className="p-4 text-center">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                <p>No products found in "{categoryName}"</p>
            </div>
        </div>
    );
};
