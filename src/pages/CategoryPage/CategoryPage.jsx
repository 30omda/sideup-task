import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { setInventory, decrementStock, clearErrors } from "@/Store/api/inventory/inventorySlice";
import useGetProducts from "@/hooks/useGetProductByCategories";
import { useProcessedProducts } from "@/hooks/useProcessedProducts";
import { ProductCard } from "@/components/CategoryPage/ProductCard";
import { ErrorNotifications } from "@/components/CategoryPage/ErrorNotifications";
import { LoadingState } from "@/components/CategoryPage/LoadingState";
import { ErrorState } from "@/components/CategoryPage/ErrorState";
import { EmptyState } from "@/components/CategoryPage/EmptyState";

// Create a shared selector that works across both pages
const selectInventoryState = createSelector(
    [(state) => state?.inventory],
    (inventory) => ({
        items: inventory?.items || {},
        cartItems: inventory?.cartItems || {},
        errors: inventory?.errors || {}
    })
);

export default function CategoryPage() {
    const { categoryName } = useParams();
    const [purchaseErrors, setPurchaseErrors] = useState({});

    const decodedCategory = useMemo(() => {
        try {
            return decodeURIComponent(categoryName || '');
        } catch (error) {
            console.error('Failed to decode category name:', error);
            return categoryName || '';
        }
    }, [categoryName]);

    const dispatch = useDispatch();
    const { data: products, isLoading, isError, error } = useGetProducts(decodedCategory);

    // Redux selectors
    const { items: inventory, cartItems, errors } = useSelector(selectInventoryState);

    // Initialize inventory from products and monitor sync
    useEffect(() => {
        if (products?.length) {
            try {
                // Only set inventory for products that don't already exist
                const productsToAdd = products.filter(product => !inventory[product.id]);
                if (productsToAdd.length > 0) {
                    dispatch(setInventory(productsToAdd));
                }


                setPurchaseErrors({});
            } catch (error) {
                console.error('Failed to initialize products:', error);
            }
        }
    }, [products, dispatch, inventory, cartItems]);

    const fixImageUrl = useCallback((url) => {
        try {
            if (!url || typeof url !== 'string') return "";
            return url.replace(/\.jpg|\.jpeg/gi, "t.png");
        } catch (error) {
            console.error('Failed to fix image URL:', error);
            return "";
        }
    }, []);

    const handlePurchase = useCallback((product) => {
        try {
            if (!product?.id) {
                setPurchaseErrors(prev => ({
                    ...prev,
                    [product?.id || 'unknown']: 'Invalid product data'
                }));
                return;
            }

            // Clear any previous error for this product
            setPurchaseErrors(prev => {
                const updated = { ...prev };
                delete updated[product.id];
                return updated;
            });

            // Dispatch to Redux (this will also update localStorage)
            dispatch(decrementStock(product.id));
        } catch (error) {
            console.error('Purchase failed:', error);
            setPurchaseErrors(prev => ({
                ...prev,
                [product?.id || 'unknown']: `Purchase failed: ${error.message}`
            }));
        }
    }, [dispatch]);

    const processedProducts = useProcessedProducts(products, inventory, cartItems, purchaseErrors);


    useEffect(() => {
        return () => {
            dispatch(clearErrors());
        };
    }, [dispatch, decodedCategory]);

    // Error state handling
    if (isLoading) {
        return <LoadingState />;
    }

    if (isError) {
        return <ErrorState error={error} />;
    }

    if (!products?.length) {
        return <EmptyState categoryName={decodedCategory} />;
    }

    return (
        <div className="w-full min-h-screen p-2 sm:p-4 mx-auto">
            <ErrorNotifications errors={errors} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                {processedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onPurchase={handlePurchase}
                        fixImageUrl={fixImageUrl}
                    />
                ))}
            </div>
        </div>
    );
}