import React from 'react';
import { Heart, ShoppingBag, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, moveToCartFromWishlist, toggleWishlist, navigateToCategory, setPage } = useStore();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Save your favorite laptops, custom gaming PCs, and gadgets to purchase them later with ease.
        </p>
        <button
          onClick={() => navigateToCategory('laptops')}
          className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
        >
          Explore IT Catalog →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Wishlist</h1>
          <p className="text-xs text-slate-500">{wishlistedProducts.length} saved products</p>
        </div>
        <button
          onClick={() => {
            wishlistedProducts.forEach(p => moveToCartFromWishlist(p.id));
            setPage('cart');
          }}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Move All to Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {wishlistedProducts.map(product => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
