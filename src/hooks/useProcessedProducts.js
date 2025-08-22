import { useMemo } from 'react';

export const useProcessedProducts = (products, inventory, cartItems, purchaseErrors) => {
    return useMemo(() => {
        if (!products?.length) return [];

        try {
            return products
                .filter(product => product?.id)
                .map(product => {

                    const inventoryStock = inventory[product.id]?.stock;
                    const cartQuantity = cartItems[product.id]?.quantity || 0;
                    const currentStock = typeof inventoryStock === 'number'
                        ? Math.max(0, inventoryStock - cartQuantity)
                        : Math.max(0, (product.stock || 20) - cartQuantity);
                    const hasError = purchaseErrors[product.id];

                    return {
                        ...product,
                        stock: currentStock,
                        itemCount: cartQuantity,
                        isOutOfStock: currentStock === 0,
                        hasError,
                        errorMessage: hasError,
                        stockStatus: currentStock === 0
                            ? "out"
                            : currentStock < 5
                                ? "low"
                                : "good"
                    };
                });
        } catch (error) {
            console.error('Failed to process products:', error);
            return [];
        }
    }, [products, inventory, cartItems, purchaseErrors]);
};
