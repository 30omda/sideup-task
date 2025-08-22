const { configureStore } = require('@reduxjs/toolkit');
const { default: inventoryReducer, setInventory, decrementStock } = require('../inventorySlice');

const mockStorage = {};
jest.mock('@/utils/localstorage/storage', () => ({
    setItem: jest.fn((key, value) => {
        mockStorage[key] = value;
        return true;
    }),
    getItem: jest.fn((key) => mockStorage[key])
}));

let store;

beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);

    store = configureStore({
        reducer: {
            inventory: inventoryReducer
        }
    });
});

test('initializes with empty state', () => {
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

test('adds products to inventory', () => {
    const mockProducts = [
        { id: 1, title: 'Test Product 1', price: 10 },
        { id: 2, title: 'Test Product 2', price: 20 }
    ];

    store.dispatch(setInventory(mockProducts));

    const state = store.getState().inventory;
    expect(Object.keys(state.items).length).toBe(2);
    expect(state.items[1].stock).toBe(20);
    expect(state.items[2].stock).toBe(20);
});
store.dispatch(setInventory(mockProducts));
const state = store.getState().inventory;

expect(Object.keys(state.items).length).toBe(2);
expect(state.items[1].stock).toBe(20);
expect(state.items[2].stock).toBe(20);
    });

test('decrements stock correctly', () => {
    store.dispatch(setInventory(mockProducts));
    store.dispatch(decrementStock(1));

    const state = store.getState().inventory;
    expect(state.items[1].stock).toBe(19);
    expect(state.cartItems[1]).toBe(1);
});

test('prevents negative stock', () => {
    store.dispatch(setInventory(mockProducts));

    // Try to decrement more times than available stock
    for (let i = 0; i < 25; i++) {
        store.dispatch(decrementStock(1));
    }

    const state = store.getState().inventory;
    expect(state.items[1].stock).toBe(0);
    expect(state.errors.purchase).toBe('Product 1 is out of stock');
});
  });

describe('Cart and Purchase Management', () => {
    test('updates cart when decrementing stock', () => {
        store.dispatch(setInventory(mockProducts));
        store.dispatch(decrementStock(1));
        store.dispatch(decrementStock(1));

        const state = store.getState().inventory;
        expect(state.cartItems[1]).toBe(2);
    });

    test('tracks purchase history', () => {
        store.dispatch(setInventory(mockProducts));
        store.dispatch(decrementStock(1));

        const state = store.getState().inventory;
        expect(state.purchaseHistory.length).toBe(1);
        expect(state.purchaseHistory[0].productId).toBe(1);
        expect(state.purchaseHistory[0].price).toBe(10);
    });

    test('updates purchased items with quantities', () => {
        store.dispatch(setInventory(mockProducts));
        store.dispatch(decrementStock(1));
        store.dispatch(decrementStock(1));

        const state = store.getState().inventory;
        expect(state.purchasedItems.length).toBe(1);
        expect(state.purchasedItems[0].id).toBe(1);
        expect(state.purchasedItems[0].quantity).toBe(2);
        expect(state.purchasedItems[0].totalPrice).toBe(20);
    });
});

describe('Notifications', () => {
    test('creates notifications for low stock', () => {
        store.dispatch(setInventory(mockProducts));

        // Reduce stock to trigger low stock notification
        for (let i = 0; i < 15; i++) {
            store.dispatch(decrementStock(1));
        }

        const state = store.getState().inventory;
        expect(state.notifications.some(n => n.type === 'low_stock')).toBe(true);
    });
});

describe('Error Handling', () => {
    test('handles invalid product IDs', () => {
        store.dispatch(setInventory(mockProducts));
        store.dispatch(decrementStock(999)); // Non-existent product

        const state = store.getState().inventory;
        expect(state.errors.purchase).toBe('Product 999 not found in inventory');
    });
});

describe('Performance', () => {
    test('handles large number of products efficiently', () => {
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
