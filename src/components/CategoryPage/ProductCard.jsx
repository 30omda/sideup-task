import React from 'react';

export const ProductCard = ({
    product,
    onPurchase,
    fixImageUrl
}) => {
    return (
        <div className="p-3 sm:p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col h-full">
            <img
                src={fixImageUrl(product.image)}
                alt={product.title}
                className="w-full h-32 sm:h-40 object-contain mb-3 sm:mb-4 rounded-md"
                onError={(e) => {
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="%23ddd" width="200" height="200"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em">No Image</text></svg>';
                }}
            />

            <div className="flex flex-col flex-grow space-y-2 sm:space-y-3">
                <h2 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2 leading-tight">
                    {product.title}
                </h2>

                <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-2 leading-relaxed">
                    {product.description}
                </p>

                <p className="font-bold text-base sm:text-lg mb-2">
                    ${product.price}
                </p>

                <div className="mt-auto space-y-2 sm:space-y-3">
                    {/* Category Badge */}
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        📂 {product.category}
                    </span>

                    {/* Cart Status */}
                    {product.itemCount > 0 && (
                        <div className="p-2 bg-green-100 rounded-md">
                            <p className="text-xs sm:text-sm text-green-700 font-medium">
                                🛒 In Cart: {product.itemCount} {product.itemCount === 1 ? 'item' : 'items'}
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {product.hasError && (
                        <div className="p-2 bg-red-100 rounded-md">
                            <p className="text-xs sm:text-sm text-red-700">
                                ⚠️ {product.errorMessage}
                            </p>
                        </div>
                    )}

                    {/* Stock Status */}
                    <p className="text-xs sm:text-sm">
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
                                : product.stock < 5
                                    ? `Low Stock (${product.stock})`
                                    : `${product.stock} available`}
                        </span>
                    </p>

                    {/* Add to Cart Button */}
                    <button
                        onClick={() => onPurchase(product)}
                        disabled={product.isOutOfStock}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-colors text-sm sm:text-base ${product.isOutOfStock
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                            }`}
                    >
                        {product.isOutOfStock ? "Out of Stock" : "🛒 Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
};
