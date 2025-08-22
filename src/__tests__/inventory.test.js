import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer, { setInventory, decrementStock, clearCart, removeFromCart } from '@/Store/api/inventory/inventorySlice';

jest.mock('@/utils/localstorage/storage', () => {
    const mockStorage = {};
    return {
        setItem: jest.fn((key, value) => {
            mockStorage[key] = value;
            return true;
        }),
        getItem: jest.fn((key) => mockStorage[key])
    };
});

// Import the mocked storage module
import * as storage from '@/utils/localstorage/storage';

describe('Inventory Slice', () => {
    let store;

    const mockProducts = [
        { id: 1, title: 'Test Product 1', price: 10 },
        { id: 2, title: 'Test Product 2', price: 20 }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        store = configureStore({
            reducer: {
                inventory: inventoryReducer
            }
        });
    });

    // Test Data Fetching
    describe('Data Fetching and State Management', () => {
        it('should initialize with empty state', () => {
            const state = store.getState().inventory;
            expect(state.items).toEqual({});
            expect(state.cartItems).toEqual({});
            expect(state.notifications).toEqual([]);
            expect(state.purchaseHistory).toEqual([]);
            expect(state.purchasedItems).toEqual([]);
            expect(state.errors).toEqual({
                storage: null,
                inventory: null,
                purchase: null
            });
        });

        it('should initialize inventory with products and default stock', () => {
            store.dispatch(setInventory(mockProducts));
            const state = store.getState().inventory;

            expect(state.items[1]).toBeDefined();
            expect(state.items[1].stock).toBe(20);
            expect(state.items[1].product).toEqual(mockProducts[0]);
            expect(storage.setItem).toHaveBeenCalled();
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
            store.dispatch(removeFromCart({ productId: 1, quantity: 1 }));
            const state = store.getState().inventory;

            expect(state.cartItems[1]).toBe(1); // Should still have 1 item since we had 2
            expect(state.items[1].stock).toBe(19); // Should be 19 since we removed 1 out of 2
            expect(state.cartItems[2]).toBe(1);
        });
    });
});
