import React from 'react';

export const ProductCard = ({
    product,
    onPurchase,
    fixImageUrl
}) => {
    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col">
            <img
                src={fixImageUrl(product.image)}
                alt={product.title}
                className="w-full h-40 object-contain mb-4"
            />
            <h2 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h2>
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">{product.description}</p>
            <p className="font-bold text-lg mb-2">${product.price}</p>

            <div className="mt-auto">
                {/* Category Badge */}
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    📂 {product.category}
                </span>

                {product.itemCount > 0 && (
                    <div className="mt-2 p-2 bg-green-100 rounded-md">
                        <p className="text-sm text-green-700 font-medium">
                            🛒 In Cart: {product.itemCount} {product.itemCount === 1 ? 'item' : 'items'}
                        </p>
                    </div>
                )}

                <p className="text-sm mt-2">
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

                <button
                    onClick={() => onPurchase(product)}
                    disabled={product.isOutOfStock}
                    className={`w-full mt-3 px-4 py-2 rounded-lg font-medium transition-colors ${product.isOutOfStock
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                        }`}
                >
                    {product.isOutOfStock ? "Out of Stock" : "🛒 Add to Cart"}
                </button>
            </div>
        </div>
    );
};
