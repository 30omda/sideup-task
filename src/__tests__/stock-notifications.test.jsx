import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer, {
    setInventory,
    decrementStock
} from '@/Store/api/inventory/inventorySlice';

// Mock localStorage
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

describe('Stock Notification Logic', () => {
    let store;

    const mockProducts = [
        { id: 1, title: 'Low Stock Product', price: 10 },
        { id: 2, title: 'Out of Stock Product', price: 20 }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        store = configureStore({
            reducer: {
                inventory: inventoryReducer
            }
        });
        store.dispatch(setInventory(mockProducts));
    });

    it('should generate low stock notification when stock falls below 5', () => {
        // Reduce stock to 4
        for (let i = 0; i < 15; i++) {
            store.dispatch(decrementStock(1));
        }

        const state = store.getState().inventory;
        const notifications = state.notifications;

        // Find low stock notification
        const lowStockNotification = notifications.find(n => n.type === 'low_stock');

        expect(lowStockNotification).toBeDefined();
        expect(lowStockNotification.title).toBe('Warning: Low Stock! ⚠️');
        expect(lowStockNotification.message).toBe('"Low Stock Product" needs restocking');
        expect(lowStockNotification.stockRemaining).toBe(5);
    });

    it('should generate out of stock notification when stock reaches 0', () => {
        // Reduce stock to 0
        for (let i = 0; i < 20; i++) {
            store.dispatch(decrementStock(2));
        }

        const state = store.getState().inventory;
        const notifications = state.notifications;

        // Find out of stock notification
        const outOfStockNotification = notifications.find(n => n.type === 'out_of_stock');

        expect(outOfStockNotification).toBeDefined();
        expect(outOfStockNotification.title).toBe('Out of Stock! 🚫');
        expect(outOfStockNotification.message).toBe('"Out of Stock Product" is no longer available');
        expect(outOfStockNotification.stockRemaining).toBe(0);
    });

    it('should not duplicate low stock notifications for the same product', () => {
        // Create a new store for this test
        const testStore = configureStore({
            reducer: {
                inventory: inventoryReducer
            }
        });

        testStore.dispatch(setInventory(mockProducts));

        // Trigger low stock notification multiple times
        for (let i = 0; i < 15; i++) {
            testStore.dispatch(decrementStock(1));
        }

        const state = testStore.getState().inventory;
        const lowStockNotifications = state.notifications.filter(n =>
            n.type === 'low_stock' && n.productId === 1
        );

        // Should only have one low stock notification per product
        expect(lowStockNotifications.length).toBe(1);
    });

    it('should track notification history accurately', () => {
        // Simulate a series of stock changes
        for (let i = 0; i < 18; i++) {
            store.dispatch(decrementStock(1));
        }

        const state = store.getState().inventory;
        const notifications = state.notifications;

        // Check notification sequence
        const notificationSequence = notifications
            .filter(n => n.productId === 1)
            .map(n => n.type);

        expect(notificationSequence).toContain('low_stock');
        expect(notifications.every(n => n.timestamp)).toBe(true);
        expect(notifications.every(n => !n.read)).toBe(true);
    });

    it('should handle multiple products stock notifications simultaneously', () => {
        // Create a new store for this test
        const testStore = configureStore({
            reducer: {
                inventory: inventoryReducer
            }
        });

        testStore.dispatch(setInventory(mockProducts));

        // Reduce stock of both products to zero
        for (let i = 0; i < 20; i++) {
            testStore.dispatch(decrementStock(1));
            testStore.dispatch(decrementStock(2));
        }

        const state = testStore.getState().inventory;
        const notifications = state.notifications;

        const product1Notifications = notifications.filter(n => n.productId === 1);
        const product2Notifications = notifications.filter(n => n.productId === 2);

        expect(product1Notifications.length).toBeGreaterThan(0);
        expect(product2Notifications.length).toBeGreaterThan(0);
        expect(notifications.some(n => n.type === 'low_stock')).toBe(true);
        expect(notifications.some(n => n.type === 'out_of_stock')).toBe(true);
    });

    // Performance test for notification system
    it('should handle rapid stock updates efficiently', () => {
        const startTime = performance.now();
        const iterations = 100;

        // Simulate rapid stock updates
        for (let i = 0; i < iterations; i++) {
            store.dispatch(decrementStock(1));
            store.dispatch(decrementStock(2));
        }

        const endTime = performance.now();
        const totalTime = endTime - startTime;
        const operationsPerSecond = (iterations * 2) / (totalTime / 1000);

        // Should handle at least 1000 operations per second
        expect(operationsPerSecond).toBeGreaterThan(1000);
        console.log(`Performance: ${operationsPerSecond.toFixed(2)} operations/second`);

        const state = store.getState().inventory;
        expect(state.notifications.length).toBeGreaterThan(0);
    });
});
