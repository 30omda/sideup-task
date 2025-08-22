import { useMemo } from 'react';

export const useSimulatedProducts = (products) => {
    return useMemo(() => {
        if (!products?.length) return [];
        const list = [];
        let idCounter = 1;
        while (list.length < 100) {
            products.forEach((p) => {
                if (list.length < 100) {
                    list.push({ ...p, id: `${p.id}-${idCounter}` });
                }
            });
            idCounter++;
        }
        return list;
    }, [products]);
};

export const useProcessedDashboardProducts = (paginatedProducts, inventory, cartItems) => {
    return useMemo(() => {
        if (!paginatedProducts?.length) return [];

        return paginatedProducts.map((product) => {
            const stock = inventory[product.id]?.stock ?? 20;
            const itemCount = cartItems[product.id] ?? 0;
            const isOutOfStock = stock === 0;

            return {
                ...product,
                stock,
                itemCount,
                isOutOfStock,
                stockStatus: isOutOfStock
                    ? "out"
                    : stock < 5
                        ? "low"
                        : "good",
            };
        });
    }, [paginatedProducts, inventory, cartItems]);
};
