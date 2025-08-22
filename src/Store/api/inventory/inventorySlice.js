
import { createSlice } from "@reduxjs/toolkit";
import { setItem, getItem } from "@/utils/localstorage/storage";

const STORAGE_KEYS = {
    INVENTORY: 'inventory_items',
    PURCHASED_ITEMS: 'inventory_purchased_items',
    CART_ITEMS: 'inventory_cart_items', // New key for cart quantities
    NOTIFICATIONS: 'inventory_notifications',
    PURCHASE_HISTORY: 'inventory_purchase_history'
};

// Get initial state directly from localStorage like authSlice
const storedItems = getItem(STORAGE_KEYS.INVENTORY);
const storedPurchasedItems = getItem(STORAGE_KEYS.PURCHASED_ITEMS);
const storedCartItems = getItem(STORAGE_KEYS.CART_ITEMS);
const storedNotifications = getItem(STORAGE_KEYS.NOTIFICATIONS);
const storedPurchaseHistory = getItem(STORAGE_KEYS.PURCHASE_HISTORY);

const initialState = {
    items: storedItems || {},
    purchasedItems: storedPurchasedItems || [],
    cartItems: storedCartItems || {}, // Add cart items to state
    notifications: storedNotifications || [],
    purchaseHistory: storedPurchaseHistory || [],
    errors: {
        storage: null,
        inventory: null,
        purchase: null
    }
};

const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        setInventory: (state, action) => {
            try {
                if (!Array.isArray(action.payload)) {
                    state.errors.inventory = 'Invalid products data: expected array';
                    return;
                }

                action.payload.forEach((product) => {
                    if (!product?.id) {
                        console.warn('Product missing ID:', product);
                        return;
                    }

                    if (!state.items[product.id]) {
                        state.items[product.id] = {
                            stock: 20,
                            product: product
                        };
                    }
                });

                // Save to localStorage with error handling
                const saveSuccess = setItem(STORAGE_KEYS.INVENTORY, state.items);
                if (!saveSuccess) {
                    state.errors.storage = 'Failed to save inventory to localStorage';
                } else {
                    // Clear storage error if save was successful
                    state.errors.storage = null;
                }

                state.errors.inventory = null;
            } catch (error) {
                state.errors.inventory = `Failed to set inventory: ${error.message}`;
                console.error('setInventory error:', error);
            }
        },

        decrementStock: (state, action) => {
            try {
                const productId = action.payload;

                if (!productId) {
                    state.errors.purchase = 'Product ID is required';
                    return;
                }

                if (!state.items[productId]) {
                    state.errors.purchase = `Product ${productId} not found in inventory`;
                    return;
                }

                if (state.items[productId].stock <= 0) {
                    state.errors.purchase = `Product ${productId} is out of stock`;
                    return;
                }

                const product = state.items[productId].product;
                const previousStock = state.items[productId].stock;
                state.items[productId].stock -= 1;
                const newStock = state.items[productId].stock;

                // Update cart items (quantity in cart)
                if (!state.cartItems[productId]) {
                    state.cartItems[productId] = 0;
                }
                state.cartItems[productId] += 1;

                // Save updated cart items and stock to localStorage
                setItem(STORAGE_KEYS.CART_ITEMS, state.cartItems);
                setItem(STORAGE_KEYS.INVENTORY, state.items);

                // Update purchased items
                const existingPurchase = state.purchasedItems.find(item => item.id === productId);
                if (existingPurchase) {
                    existingPurchase.quantity += 1;
                    existingPurchase.totalPrice = existingPurchase.quantity * product.price;
                } else {
                    state.purchasedItems.push({
                        id: productId,
                        title: product.title,
                        price: product.price,
                        quantity: 1,
                        totalPrice: product.price,
                        purchaseDate: new Date().toISOString()
                    });
                }

                // Add to purchase history
                state.purchaseHistory.push({
                    id: `purchase_${Date.now()}`,
                    productId: productId,
                    productTitle: product.title,
                    price: product.price,
                    purchaseTime: new Date().toISOString(),
                    stockBefore: previousStock,
                    stockAfter: newStock,
                    cartQuantity: state.cartItems[productId],
                    message: `✅ Purchased ${product.title} - Remaining Stock: ${newStock} items`
                });

                // Add notifications
                const notificationId = Date.now();
                const newNotifications = [{
                    id: notificationId,
                    type: 'purchase_success',
                    title: 'Purchase Successful! 🎉',
                    message: `Successfully purchased "${product.title}"`,
                    details: `Price: ${product.price} | Remaining Stock: ${newStock} | In Cart: ${state.cartItems[productId]}`,
                    productId: productId,
                    productName: product.title,
                    stockRemaining: newStock,
                    cartQuantity: state.cartItems[productId],
                    timestamp: new Date().toISOString(),
                    read: false
                }];

                // Stock status notifications
                if (newStock === 0) {
                    newNotifications.push({
                        id: notificationId + 1,
                        type: 'out_of_stock',
                        title: 'Out of Stock! 🚫',
                        message: `"${product.title}" is no longer available`,
                        details: 'Please restock inventory',
                        productId: productId,
                        productName: product.title,
                        stockRemaining: 0,
                        timestamp: new Date().toISOString(),
                        read: false
                    });
                } else if (newStock <= 5) {
                    newNotifications.push({
                        id: notificationId + 2,
                        type: 'low_stock',
                        title: 'Warning: Low Stock! ⚠️',
                        message: `"${product.title}" needs restocking`,
                        details: `Remaining: ${newStock} items only`,
                        productId: productId,
                        productName: product.title,
                        stockRemaining: newStock,
                        timestamp: new Date().toISOString(),
                        read: false
                    });
                }

                state.notifications.push(...newNotifications);

                // Save all state to localStorage directly like authSlice
                setItem(STORAGE_KEYS.INVENTORY, state.items);
                setItem(STORAGE_KEYS.CART_ITEMS, state.cartItems);
                setItem(STORAGE_KEYS.PURCHASED_ITEMS, state.purchasedItems);
                setItem(STORAGE_KEYS.NOTIFICATIONS, state.notifications);
                setItem(STORAGE_KEYS.PURCHASE_HISTORY, state.purchaseHistory);

                state.errors.purchase = null;
            } catch (error) {
                state.errors.purchase = `Failed to process purchase: ${error.message}`;
                console.error('decrementStock error:', error);
            }
        },

        restockProduct: (state, action) => {
            try {
                const { productId, quantity = 20 } = action.payload || {};

                if (!productId) {
                    state.errors.inventory = 'Product ID is required for restocking';
                    return;
                }

                if (!state.items[productId]) {
                    state.errors.inventory = `Product ${productId} not found in inventory`;
                    return;
                }

                if (typeof quantity !== 'number' || quantity < 0) {
                    state.errors.inventory = 'Invalid quantity for restocking';
                    return;
                }

                const previousStock = state.items[productId].stock;
                state.items[productId].stock = quantity;

                state.notifications.push({
                    id: Date.now(),
                    type: 'restock',
                    title: 'Restocked! 📦',
                    message: `Restocked "${state.items[productId].product.title}"`,
                    details: `From ${previousStock} to ${quantity} items`,
                    productId: productId,
                    stockRemaining: quantity,
                    timestamp: new Date().toISOString(),
                    read: false
                });

                // Save to localStorage
                const saveSuccess = setItem(STORAGE_KEYS.INVENTORY, state.items) &&
                    setItem(STORAGE_KEYS.NOTIFICATIONS, state.notifications);

                if (!saveSuccess) {
                    state.errors.storage = 'Failed to save restock data';
                } else {
                    state.errors.storage = null;
                }

                state.errors.inventory = null;
            } catch (error) {
                state.errors.inventory = `Failed to restock: ${error.message}`;
                console.error('restockProduct error:', error);
            }
        },

        clearErrors: (state, action) => {
            const errorType = action.payload;
            if (errorType && state.errors[errorType]) {
                state.errors[errorType] = null;
            } else {
                state.errors = {
                    storage: null,
                    inventory: null,
                    purchase: null
                };
            }
        },

        // ... other existing reducers with error handling
        markNotificationAsRead: (state, action) => {
            try {
                const notificationId = action.payload;
                const notification = state.notifications.find(n => n.id === notificationId);
                if (notification) {
                    notification.read = true;
                    setItem(STORAGE_KEYS.NOTIFICATIONS, state.notifications);
                }
            } catch (error) {
                console.error('markNotificationAsRead error:', error);
            }
        },

        clearAllNotifications: (state) => {
            try {
                state.notifications = [];
                setItem(STORAGE_KEYS.NOTIFICATIONS, []);
            } catch (error) {
                console.error('clearAllNotifications error:', error);
            }
        },

        removeNotification: (state, action) => {
            try {
                const notificationId = action.payload;
                state.notifications = state.notifications.filter(n => n.id !== notificationId);
                setItem(STORAGE_KEYS.NOTIFICATIONS, state.notifications);
            } catch (error) {
                console.error('removeNotification error:', error);
            }
        },

        markAllNotificationsAsRead: (state) => {
            try {
                state.notifications.forEach(notification => {
                    notification.read = true;
                });
                setItem(STORAGE_KEYS.NOTIFICATIONS, state.notifications);
            } catch (error) {
                console.error('markAllNotificationsAsRead error:', error);
            }
        },

        clearCart: (state) => {
            try {
                // Restore stock for each item in cart
                Object.entries(state.cartItems).forEach(([productId, quantity]) => {
                    if (state.items[productId]) {
                        state.items[productId].stock += quantity;
                    }
                });

                // Clear cart and update localStorage
                state.cartItems = {};
                setItem(STORAGE_KEYS.CART_ITEMS, state.cartItems);
                setItem(STORAGE_KEYS.INVENTORY, state.items);
            } catch (error) {
                state.errors.storage = `Failed to clear cart: ${error.message}`;
                console.error('clearCart error:', error);
            }
        },

        removeFromCart: (state, action) => {
            try {
                const { productId, quantity = 1 } = action.payload;

                if (!productId) {
                    state.errors.purchase = 'Product ID is required';
                    return;
                }

                // Handle cart items
                if (state.cartItems[productId]) {
                    // Update cart quantity
                    state.cartItems[productId] = Math.max(0, state.cartItems[productId] - quantity);

                    // Remove from cart if quantity becomes 0
                    if (state.cartItems[productId] === 0) {
                        delete state.cartItems[productId];
                    }
                }

                // Handle purchased items
                const purchasedItem = state.purchasedItems.find(item => item.id === productId);
                if (purchasedItem) {
                    // Decrement quantity
                    purchasedItem.quantity -= quantity;
                    purchasedItem.totalPrice = purchasedItem.quantity * purchasedItem.price;

                    // If quantity reaches 0, remove from purchased items
                    if (purchasedItem.quantity <= 0) {
                        state.purchasedItems = state.purchasedItems.filter(item => item.id !== productId);
                    }
                }

                // Restore stock to inventory
                if (state.items[productId]) {
                    state.items[productId].stock += quantity;
                }

                // Add notification about the removal
                const product = state.items[productId]?.product ||
                    (purchasedItem ? { title: purchasedItem.title } : { title: 'Unknown Product' });
                state.notifications.push({
                    id: Date.now(),
                    type: 'item_removed',
                    title: 'Item Removed from Cart',
                    message: `Removed ${quantity} ${quantity > 1 ? 'items' : 'item'} of "${product.title}" from cart`,
                    details: `Current stock: ${state.items[productId]?.stock || 0}`,
                    productId: productId,
                    productName: product.title,
                    timestamp: new Date().toISOString(),
                    read: false
                });

                // Save all updated state to localStorage
                setItem(STORAGE_KEYS.CART_ITEMS, state.cartItems);
                setItem(STORAGE_KEYS.PURCHASED_ITEMS, state.purchasedItems);
                setItem(STORAGE_KEYS.INVENTORY, state.items);
                setItem(STORAGE_KEYS.NOTIFICATIONS, state.notifications);

            } catch (error) {
                state.errors.storage = `Failed to remove from cart: ${error.message}`;
                console.error('removeFromCart error:', error);
            }
        },
    },
});

export const {
    setInventory,
    decrementStock,
    markNotificationAsRead,
    clearAllNotifications,
    removeNotification,
    markAllNotificationsAsRead,
    clearPurchaseHistory,
    restockProduct,
    clearErrors,
    clearCart,
    removeFromCart
} = inventorySlice.actions;

export default inventorySlice.reducer;