export function setItem(key, value) {
    try {
        if (typeof key !== 'string' || key.trim() === '') {
            throw new Error('Invalid key: must be a non-empty string');
        }

        if (value === undefined) {
            console.warn(`Attempting to store undefined value for key: ${key}`);
            return false;
        }

        const serializedValue = JSON.stringify(value);

        // Check localStorage availability and quota
        if (!isLocalStorageAvailable()) {
            throw new Error('localStorage is not available');
        }

        localStorage.setItem(key, serializedValue);
        return true;
    } catch (error) {
        console.error(`Failed to save to localStorage (key: ${key}):`, error);

        // Handle quota exceeded error
        if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            console.warn('localStorage quota exceeded, attempting cleanup...');
            handleStorageQuotaExceeded(key, value);
        }

        return false;
    }
}

export function getItem(key, defaultValue = null) {
    try {
        if (typeof key !== 'string' || key.trim() === '') {
            console.warn('Invalid key provided to getItem:', key);
            return defaultValue;
        }

        if (!isLocalStorageAvailable()) {
            console.warn('localStorage is not available');
            return defaultValue;
        }

        const value = localStorage.getItem(key);

        if (value === null) {
            return defaultValue;
        }

        return JSON.parse(value);
    } catch (error) {
        console.error(`Failed to retrieve from localStorage (key: ${key}):`, error);

        // If parsing fails, try to clean up corrupted data
        if (error instanceof SyntaxError) {
            console.warn(`Corrupted data found for key ${key}, removing...`);
            removeItem(key);
        }

        return defaultValue;
    }
}

export function removeItem(key) {
    try {
        if (typeof key !== 'string' || key.trim() === '') {
            console.warn('Invalid key provided to removeItem:', key);
            return false;
        }

        if (!isLocalStorageAvailable()) {
            console.warn('localStorage is not available');
            return false;
        }

        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Failed to remove from localStorage (key: ${key}):`, error);
        return false;
    }
}

export function clear() {
    try {
        if (!isLocalStorageAvailable()) {
            console.warn('localStorage is not available');
            return false;
        }

        const preservedKeys = ["selectedLanguage", "i18nextLng"];
        const keysToRemove = [];

        // Collect keys to remove
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && !preservedKeys.includes(key)) {
                keysToRemove.push(key);
            }
        }

        // Remove collected keys
        keysToRemove.forEach(key => localStorage.removeItem(key));
        return true;
    } catch (error) {
        console.error('Failed to clear localStorage:', error);
        return false;
    }
}

// Utility functions
function isLocalStorageAvailable() {
    try {
        const testKey = '__localStorage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}

function handleStorageQuotaExceeded(key, value) {
    try {
        // Clear old notifications first
        const notifications = getItem('inventory_notifications', []);
        if (notifications.length > 50) {
            setItem('inventory_notifications', notifications.slice(-25));
        }

        // Clear old purchase history
        const purchaseHistory = getItem('inventory_purchase_history', []);
        if (purchaseHistory.length > 100) {
            setItem('inventory_purchase_history', purchaseHistory.slice(-50));
        }

        // Try to save again
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Failed to handle storage quota exceeded:', error);
    }
}

export const clearPurchaseHistory = () => {
    try {
        setItem('inventory_purchase_history', []);
        return true;
    } catch (error) {
        console.error('clearPurchaseHistory error:', error);
        return false;
    }
};