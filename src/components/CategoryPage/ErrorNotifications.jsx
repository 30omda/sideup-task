import React from 'react';
import { useDispatch } from 'react-redux';
import { clearErrors } from '@/Store/api/inventory/inventorySlice';

export const ErrorNotifications = ({ errors }) => {
    const dispatch = useDispatch();

    return (
        <>
            {errors.storage && (
                <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
                    <h3 className="font-semibold">Storage Warning</h3>
                    <p className="text-sm">{errors.storage}</p>
                    <button
                        onClick={() => dispatch(clearErrors('storage'))}
                        className="mt-1 text-xs underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {errors.inventory && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <h3 className="font-semibold">Inventory Error</h3>
                    <p className="text-sm">{errors.inventory}</p>
                    <button
                        onClick={() => dispatch(clearErrors('inventory'))}
                        className="mt-1 text-xs underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </>
    );
};
