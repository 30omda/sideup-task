import React from 'react';

export const ProductCard = ({
    product,
    onPurchase,
    fixImageUrl
}) => {
    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
            <img
                src={fixImageUrl(product.image)}
                alt={product.title || 'Product'}
                className="w-full h-40 object-contain mb-4"
                onError={(e) => {
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="%23ddd" width="200" height="200"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em">No Image</text></svg>';
                }}
            />
            <h2 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h2>
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                {product.description}
            </p>
            <p className="font-bold text-lg">${product.price}</p>

            {/* Category Badge */}
            <div className="mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    📂 {product.category}
                </span>
            </div>

            {product.itemCount > 0 && (
                <div className="mt-2 p-2 bg-green-100 rounded-md">
                    <p className="text-sm text-green-700 font-medium">
                        🛒 In Cart: {product.itemCount} pieces
                    </p>
                </div>
            )}

            {/* Error message for specific product */}
            {product.hasError && (
                <div className="mt-2 p-2 bg-red-100 rounded-md">
                    <p className="text-sm text-red-700">
                        ⚠️ {product.errorMessage}
                    </p>
                </div>
            )}

            <div className="mt-2">
                <p className="text-sm">
                    Stock:{" "}
                    <span
                        className={
                            product.isOutOfStock
                                ? "text-red-600 font-semibold"
                                : product.stock < 5
                                    ? "text-yellow-600 font-semibold"
                                    : "text-green-600"
                        }
                    >
                        {product.isOutOfStock
                            ? "Out of Stock"
                            : `${product.stock} available`}
                    </span>
                </p>
            </div>

            <button
                onClick={() => onPurchase(product)}
                disabled={product.isOutOfStock}
                className={`mt-4 w-full py-2 px-4 rounded-md transition-colors ${product.isOutOfStock
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
            >
                {product.isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
        </div>
    );
};
