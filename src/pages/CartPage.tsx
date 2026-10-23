import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  Check, 
  X, 
  ShieldCheck, 
  Truck,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    cartSubtotal, 
    cartDiscount, 
    cartDeliveryFee, 
    cartGrandTotal, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    coupons,
    setPage,
    navigateToCategory
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore our range of flagship laptops, mobile phones, gaming battlestations, and genuine IT accessories.
        </p>
        <button
          onClick={() => navigateToCategory('laptops')}
          className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
        >
          Explore All Products →
        </button>
      </div>
    );
  }

  // Free shipping threshold indicator
  const freeShippingThreshold = 999;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-slate-500">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-slate-500 hover:text-red-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert Bar */}
          {amountToFreeShipping > 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-center gap-3">
              <Truck className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                Add items worth <strong>₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> more to unlock <strong>FREE Express Shipping</strong>!
              </span>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 flex items-center gap-3">
              <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Congratulations! Your order qualifies for <strong>FREE Blue Dart Air Express Delivery</strong>.
              </span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
            {cart.map((item) => (
              <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-contain rounded-xl bg-slate-50 p-2 border border-slate-100 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                    {item.product.brand}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {item.product.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    ₹{item.product.price.toLocaleString('en-IN')} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <span className="text-sm font-black text-slate-900 tabular-nums min-w-[80px] text-right">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => navigateToCategory('laptops')}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 hover:underline flex items-center gap-1"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Discount ({appliedCoupon.code})</span>
                  </span>
                  <span className="tabular-nums">-₹{cartDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Shipping & Handling</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {cartDeliveryFee === 0 ? (
                    <span className="text-emerald-600 uppercase font-bold">FREE</span>
                  ) : (
                    `₹${cartDeliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Estimated GST (18% included)</span>
                <span className="tabular-nums font-mono">₹{Math.round(cartSubtotal * 0.18).toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Grand Total</span>
                <span className="text-xl sm:text-2xl font-black text-purple-700 tabular-nums">
                  ₹{cartGrandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-purple-700" />
                <span>Apply Promo Coupon</span>
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <div>
                      <strong className="text-emerald-900">{appliedCoupon.code}</strong>
                      <p className="text-[10px] text-emerald-700">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 text-slate-400 hover:text-red-600"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. TIME4LAPTOP10"
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg uppercase font-bold focus:bg-white focus:outline-none focus:border-purple-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Click-to-apply coupon suggestions */}
              {!appliedCoupon && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Available Coupons:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {coupons.map(c => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => applyCoupon(c.code)}
                        className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded border border-purple-200 text-[10px] font-mono font-bold transition-colors"
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => setPage('checkout')}
              className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.01]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security assurance */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit SSL Encrypted & RBI Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
