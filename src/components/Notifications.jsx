import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Bell, ShoppingCart, Package, DollarSign, BarChart3 } from 'lucide-react'
import { removeFromCart } from '@/Store/api/inventory/inventorySlice'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const NotificationsCart = () => {
    const dispatch = useDispatch();

    const notifications = useSelector(state => state?.inventory?.notifications || [])
    const purchasedItems = useSelector(state => state?.inventory?.purchasedItems || [])
    const inventoryItems = useSelector(state => state?.inventory?.items || {})


    const totalItems = purchasedItems.reduce((total, item) => total + item.quantity, 0)


    const unreadNotifications = notifications.filter(notification => !notification.read)


    const cartItemsWithDetails = purchasedItems.map(item => {
        const inventoryItem = inventoryItems[item.id]
        const product = inventoryItem?.product || {}

        return {
            ...item,
            title: product.title || item.title || 'Unknown Product',
            price: product.price || item.price || 0,
            category: product.category || 'Uncategorized',
            stockLevel: inventoryItem?.stock || Math.floor(Math.random() * 20) + 1, // Mock stock level
            image: product.image || null
        }
    })


    const getStockStatusColor = (stock) => {
        if (stock === 0) return 'bg-red-100 text-red-800'
        if (stock <= 5) return 'bg-yellow-100 text-yellow-800'
        return 'bg-green-100 text-green-800'
    }


    const getStockStatusText = (stock) => {
        if (stock === 0) return 'Out of Stock'
        if (stock <= 5) return `Low Stock (${stock})`
        return `In Stock (${stock})`
    }

    return (
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                        <Bell className="h-4 w-4" />
                        {totalItems > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
                            >
                                {totalItems > 99 ? '99+' : totalItems}
                            </Badge>
                        )}
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-96 max-h-96" align="end">
                    <DropdownMenuLabel className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            <span>Cart Notifications</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {cartItemsWithDetails.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        // Clear cart items
                                        cartItemsWithDetails.forEach(item => {
                                            dispatch(removeFromCart({
                                                productId: item.id,
                                                quantity: item.quantity
                                            }));
                                        });
                                    }}
                                    className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                                >
                                    <span>Clear Cart</span>
                                </Button>
                            )}
                            <Badge variant="secondary">
                                {totalItems} {totalItems === 1 ? 'item' : 'items'}
                            </Badge>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <ScrollArea className="h-80">
                        {cartItemsWithDetails.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No items in cart</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {cartItemsWithDetails.map((item, index) => (
                                    <DropdownMenuItem key={`${item.id}-${index}`} className="p-0">
                                        <div className="w-full p-3 hover:bg-gray-50 rounded-md">
                                            <div className="flex items-start gap-3">
                                                {/* Product Image */}
                                                {item.image && (
                                                    <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-medium text-sm text-gray-900 truncate">
                                                            {item.title}
                                                        </h4>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                dispatch(removeFromCart({
                                                                    productId: item.id,
                                                                    quantity: 1
                                                                }));
                                                            }}
                                                            className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mb-1 capitalize">
                                                        {item.category}
                                                    </p>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="flex items-center gap-1 text-xs text-gray-600">
                                                            <DollarSign className="h-3 w-3" />
                                                            <span>${item.price}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-400">×</span>
                                                        <Badge variant="outline" className="text-xs px-1 py-0">
                                                            {item.quantity}
                                                        </Badge>
                                                        <span className="text-xs font-medium text-gray-800">
                                                            = ${(item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>

                                                    {/* Stock Level */}
                                                    <div className="flex items-center justify-between gap-1">
                                                        <div className="flex items-center gap-1">
                                                            <BarChart3 className="h-3 w-3 text-gray-400" />
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-xs px-2 py-0 ${getStockStatusColor(item.stockLevel)}`}
                                                            >
                                                                {getStockStatusText(item.stockLevel)}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    dispatch(removeFromCart({ productId: item.id, quantity: 1 }));
                                                                }}
                                                                className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Purchase Date */}
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        🕒 {new Date(item.purchaseDate).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    {cartItemsWithDetails.length > 0 && (
                        <>
                            <DropdownMenuSeparator />
                            <div className="p-3 bg-gray-50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-sm">Total:</span>
                                    <span className="font-bold text-lg">
                                        ${cartItemsWithDetails.reduce((total, item) =>
                                            total + (item.price * item.quantity), 0
                                        ).toFixed(2)}
                                    </span>
                                </div>
                                <Button className="w-full text-sm" size="sm">
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            {unreadNotifications.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
        </div>
    )
}
export default NotificationsCart