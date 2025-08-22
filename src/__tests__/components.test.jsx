import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { ProductCard } from '@/components/CategoryPage/ProductCard';
import { LoadingState } from '@/components/CategoryPage/LoadingState';
import { ErrorState } from '@/components/CategoryPage/ErrorState';
import inventoryReducer from '@/Store/api/inventory/inventorySlice';

// Mock store
const createMockStore = (initialState = {}) => {
    return configureStore({
        reducer: {
            inventory: inventoryReducer
        },
        preloadedState: initialState
    });
};

describe('ProductCard Component', () => {
    const mockProduct = {
        id: 1,
        title: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        category: 'Electronics',
        image: 'test.jpg',
        stock: 10,
        itemCount: 0,
        isOutOfStock: false
    };

    const mockFixImageUrl = (url) => url;
    const mockOnPurchase = jest.fn();

    it('renders product information correctly', () => {
        render(
            <ProductCard
                product={mockProduct}
                onPurchase={mockOnPurchase}
                fixImageUrl={mockFixImageUrl}
            />
        );

        expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
        expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
        expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
        expect(screen.getByText(`📂 ${mockProduct.category}`)).toBeInTheDocument();
        expect(screen.getByText('10 available')).toBeInTheDocument();
    });

    it('handles out of stock state correctly', () => {
        const outOfStockProduct = {
            ...mockProduct,
            stock: 0,
            isOutOfStock: true
        };

        render(
            <ProductCard
                product={outOfStockProduct}
                onPurchase={mockOnPurchase}
                fixImageUrl={mockFixImageUrl}
            />
        );

        const outOfStockTexts = screen.getAllByText('Out of Stock');
        expect(outOfStockTexts.length).toBeGreaterThan(0);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('shows cart quantity when items are in cart', () => {
        const productInCart = {
            ...mockProduct,
            itemCount: 3
        };

        render(
            <ProductCard
                product={productInCart}
                onPurchase={mockOnPurchase}
                fixImageUrl={mockFixImageUrl}
            />
        );

        expect(screen.getByText('🛒 In Cart: 3 pieces')).toBeInTheDocument();
    });

    it('displays error message when product has error', () => {
        const productWithError = {
            ...mockProduct,
            hasError: true,
            errorMessage: 'Failed to add to cart'
        };

        render(
            <ProductCard
                product={productWithError}
                onPurchase={mockOnPurchase}
                fixImageUrl={mockFixImageUrl}
            />
        );

        expect(screen.getByText('⚠️ Failed to add to cart')).toBeInTheDocument();
    });

    it('shows warning for low stock', () => {
        const lowStockProduct = {
            ...mockProduct,
            stock: 3
        };

        render(
            <ProductCard
                product={lowStockProduct}
                onPurchase={mockOnPurchase}
                fixImageUrl={mockFixImageUrl}
            />
        );

        expect(screen.getByText('3 available')).toHaveClass('text-yellow-600');
    });
});

describe('LoadingState Component', () => {
    it('renders loading indicator', () => {
        render(<LoadingState />);
        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    // Performance test for loading state
    it('renders quickly', () => {
        const startTime = performance.now();
        const iterations = 100;

        for (let i = 0; i < iterations; i++) {
            render(<LoadingState />);
        }

        const endTime = performance.now();
        const averageRenderTime = (endTime - startTime) / iterations;

        expect(averageRenderTime).toBeLessThan(5); // Should render in less than 5ms on average
    });
});

describe('ErrorState Component', () => {
    it('renders error message', () => {
        const error = { message: 'Network Error' };
        render(<ErrorState error={error} />);

        expect(screen.getByText('Failed to load products')).toBeInTheDocument();
        expect(screen.getByText('Network Error')).toBeInTheDocument();
    });

    it('handles missing error message', () => {
        render(<ErrorState error={{}} />);
        expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    });

    it('has working retry button', () => {
        render(<ErrorState error={{}} />);
        const button = screen.getByText('Retry');

        expect(button).toBeInTheDocument();
        expect(button.closest('button')).toHaveClass('mt-2 bg-red-600');
    });
});

// Performance test suite for large lists
describe('Performance Tests', () => {
    const generateMockProducts = (count) => {
        return Array.from({ length: count }, (_, index) => ({
            id: index + 1,
            title: `Product ${index + 1}`,
            description: 'Test Description',
            price: 99.99,
            category: 'Electronics',
            image: 'test.jpg',
            stock: 10,
            itemCount: 0,
            isOutOfStock: false
        }));
    };

    it('renders large list of products efficiently', () => {
        const mockProducts = generateMockProducts(1000);
        const startTime = performance.now();

        mockProducts.forEach(product => {
            render(
                <ProductCard
                    product={product}
                    onPurchase={() => { }}
                    fixImageUrl={(url) => url}
                />
            );
        });

        const endTime = performance.now();
        const totalRenderTime = endTime - startTime;
        const averageRenderTime = totalRenderTime / mockProducts.length;

        expect(averageRenderTime).toBeLessThan(5); // Each card should render in less than 5ms
        console.log(`Average render time per card: ${averageRenderTime.toFixed(2)}ms`);
    });
});
