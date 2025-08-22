import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer, { setInventory } from '../inventorySlice';

jest.mock('@/utils/localstorage/storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn()
}));

describe('Inventory Slice', () => {
    let store;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                inventory: inventoryReducer
            }
        });
    });

    it('should initialize with empty state', () => {
        const state = store.getState().inventory;
        expect(state.items).toEqual({});
    });
});
        });

it('should handle invalid product data', () => {
    store.dispatch(setInventory('invalid data'));
    const state = store.getState().inventory;

    expect(state.errors.inventory).toBe('Invalid products data: expected array');
});

it('should skip products without IDs', () => {
    const productsWithInvalidItem = [...mockProducts, { title: 'No ID' }];
    store.dispatch(setInventory(productsWithInvalidItem));
    const state = store.getState().inventory;

    expect(Object.keys(state.items).length).toBe(2);
    expect(state.items[1]).toBeDefined();
    expect(state.items[2]).toBeDefined();
});
    });

// Test Stock Management
describe('Stock Management', () => {
    beforeEach(() => {
        store.dispatch(setInventory(mockProducts));
    });

    it('should decrement stock correctly', () => {
        store.dispatch(decrementStock(1));
        const state = store.getState().inventory;

        expect(state.items[1].stock).toBe(19);
        expect(state.cartItems[1]).toBe(1);
    });

    it('should prevent negative stock', () => {
        // Try to decrement more times than available stock
        for (let i = 0; i < 25; i++) {
            store.dispatch(decrementStock(1));
        }

        const state = store.getState().inventory;
        expect(state.items[1].stock).toBe(0);
        expect(state.errors.purchase).toBe('Product 1 is out of stock');
    });

    it('should update cart quantities', () => {
        store.dispatch(decrementStock(1));
        store.dispatch(decrementStock(1));

        const state = store.getState().inventory;
        expect(state.cartItems[1]).toBe(2);
    });
});

// Test Cart Management
describe('Cart Management', () => {
    beforeEach(() => {
        store.dispatch(setInventory(mockProducts));
        store.dispatch(decrementStock(1));
        store.dispatch(decrementStock(1));
        store.dispatch(decrementStock(2));
    });

    it('should clear cart correctly', () => {
        store.dispatch(clearCart());
        const state = store.getState().inventory;

        expect(state.cartItems).toEqual({});
        expect(state.items[1].stock).toBe(20);
        expect(state.items[2].stock).toBe(20);
    });

    it('should remove individual items from cart', () => {
        store.dispatch(removeFromCart(1));
        const state = store.getState().inventory;

        expect(state.cartItems[1]).toBeUndefined();
        expect(state.items[1].stock).toBe(20);
        expect(state.cartItems[2]).toBe(1);
    });
});

// Test Stock Notification Logic
describe('Stock Notification Logic', () => {
    beforeEach(() => {
        store.dispatch(setInventory(mockProducts));
    });

    it('should create low stock notification when stock falls below 5', () => {
        // Reduce stock to 5
        for (let i = 0; i < 15; i++) {
            store.dispatch(decrementStock(1));
        }
        const state = store.getState().inventory;

        const lowStockNotification = state.notifications.find(
            n => n.type === 'low_stock' && n.productId === 1
        );

        expect(lowStockNotification).toBeDefined();
        expect(lowStockNotification.type).toBe('low_stock');
        expect(lowStockNotification.message).toContain('low on stock');
    });

    it('should create out of stock notification when stock reaches 0', () => {
        // Reduce stock to 0
        for (let i = 0; i < 20; i++) {
            store.dispatch(decrementStock(1));
        }
        const state = store.getState().inventory;

        const outOfStockNotification = state.notifications.find(
            n => n.type === 'out_of_stock' && n.productId === 1
        );

        expect(outOfStockNotification).toBeDefined();
        expect(outOfStockNotification.type).toBe('out_of_stock');
        expect(outOfStockNotification.message).toContain('out of stock');
    });
});

// Test Restock Functionality
describe('Restock Functionality', () => {
    beforeEach(() => {
        store.dispatch(setInventory(mockProducts));
    });

    it('should restock products correctly', () => {
        store.dispatch(decrementStock(1)); // Reduce stock first
        store.dispatch(restockProduct({ productId: 1, quantity: 5 }));

        const state = store.getState().inventory;
        expect(state.items[1].stock).toBe(24); // 19 (after decrement) + 5
    });

    it('should handle invalid restock quantities', () => {
        store.dispatch(restockProduct({ productId: 1, quantity: -5 }));

        const state = store.getState().inventory;
        expect(state.errors.inventory).toBe('Invalid restock quantity: must be positive');
        expect(state.items[1].stock).toBe(20); // Unchanged
    });

    it('should handle restocking non-existent products', () => {
        store.dispatch(restockProduct({ productId: 999, quantity: 5 }));

        const state = store.getState().inventory;
        expect(state.errors.inventory).toBe('Product 999 not found in inventory');
    });
});

// Test Large Dataset Performance
describe('Performance Testing', () => {
    it('should handle large datasets efficiently', () => {
        const largeProductSet = Array.from({ length: 1000 }, (_, index) => ({
            id: index + 1,
            title: `Product ${index + 1}`,
            price: Math.floor(Math.random() * 100)
        }));

        const startTime = performance.now();
        store.dispatch(setInventory(largeProductSet));
        const endTime = performance.now();

        const state = store.getState().inventory;
        expect(endTime - startTime).toBeLessThan(1000); // Should process in less than 1 second
        expect(Object.keys(state.items).length).toBe(1000);
    });
});
});
