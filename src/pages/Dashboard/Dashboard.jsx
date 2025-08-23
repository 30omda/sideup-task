import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { setInventory, decrementStock } from "@/Store/api/inventory/inventorySlice";
import useGetProducts from "@/hooks/useGetProducts";
import { useSimulatedProducts, useProcessedDashboardProducts } from "@/hooks/useDashboardProducts";
import { ProductCard } from "@/components/Dashboard/ProductCard";
import { LoadingState } from "@/components/Dashboard/LoadingState";
import { ErrorState } from "@/components/Dashboard/ErrorState";
import { EmptyState } from "@/components/Dashboard/EmptyState";

const selectInventoryState = createSelector(
    [(state) => state?.inventory],
    (inventory) => {

        return {
            items: inventory?.items || {},
            cartItems: inventory?.cartItems || {},
        };
    }
)

export default function Dashboard() {
    const [visibleCount, setVisibleCount] = useState(20);

    const dispatch = useDispatch();
    const { data: products, isLoading, isError } = useGetProducts();
    const { items: inventory, cartItems } = useSelector(selectInventoryState);

    const simulatedProducts = useSimulatedProducts(products);
    const paginatedProducts = simulatedProducts.slice(0, visibleCount);
    const processedProducts = useProcessedDashboardProducts(paginatedProducts, inventory, cartItems);

    // --- Initialize inventory ---
    useEffect(() => {
        if (!paginatedProducts || paginatedProducts.length === 0) return;
        dispatch(setInventory(paginatedProducts));
    }, [paginatedProducts, dispatch]);

    // --- Infinite scroll handler ---
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 100 >=
                document.documentElement.scrollHeight
            ) {
                setVisibleCount((prev) => Math.min(prev + 20, simulatedProducts.length));
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [simulatedProducts]);

    // --- Helpers ---
    const fixImageUrl = useCallback((url) => {
        if (!url) return "";
        return url.replace(/\.jpg|\.jpeg/, "t.png");
    }, []);

    const handlePurchase = useCallback(
        (product) => {
            dispatch(decrementStock(product.id));
        },
        [dispatch, inventory, cartItems]
    );
    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState />;
    if (!processedProducts?.length) return <EmptyState />;

    // --- Render ---
    return (
        <div className="p-2 sm:p-4 mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 w-full">
                {processedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onPurchase={handlePurchase}
                        fixImageUrl={fixImageUrl}
                    />
                ))}
            </div>

            {/* Show loading more */}
            {visibleCount < simulatedProducts.length && (
                <p className="text-center mt-6 text-gray-500 text-sm sm:text-base">Loading more products...</p>
            )}
        </div>
    );
}
