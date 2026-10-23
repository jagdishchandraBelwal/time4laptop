import React from 'react';
import { Star, Heart, ShoppingCart, Check, Zap, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    navigateToProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    cart,
    setPage
  } = useStore();

  const isWishlisted = isInWishlist(product.id);
  const cartItem = cart.find(item => item.product.id === product.id);
  const inCart = !!cartItem;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inCart) {
      addToCart(product, 1);
    }
    setPage('checkout');
  };

  // Spec highlight extraction
  const getHighlightSpec = () => {
    if (product.specs.processor && product.specs.ram) {
      return `${product.specs.processor.split('(')[0].trim()} · ${product.specs.ram}`;
    }
    if (product.specs.display && product.specs.camera) {
      return `${product.specs.camera.split('+')[0].trim()} · ${product.specs.display.split('(')[0].trim()}`;
    }
    if (product.specs.capacity) {
      return `${product.specs.capacity} · ${product.specs.speed || ''}`;
    }
    return product.subCategory || 'Refurbished IT Hardware';
  };

  const condition = product.conditionGrade || 'Grade A - Like New';

  return (
    <div 
      onClick={() => navigateToProduct(product.id)}
      className="group bg-white rounded-xl border border-slate-200/80 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-200 flex flex-col cursor-pointer overflow-hidden relative"
    >
      {/* Top badges & Wishlist Button */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="bg-purple-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              {product.badge}
            </span>
          )}
          {/* Refurbished Condition Grade Tag */}
          <span className={`text-[10px] font-black px-2 py-0.5 rounded shadow-sm backdrop-blur border ${
            condition.includes('Grade A')
              ? 'bg-emerald-600/90 text-white border-emerald-500'
              : condition.includes('Grade B')
              ? 'bg-blue-600/90 text-white border-blue-500'
              : 'bg-amber-600/90 text-white border-amber-500'
          }`}>
            {condition}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-1.5 rounded-full pointer-events-auto transition-colors ${
            isWishlisted
              ? 'bg-pink-50 text-pink-600 shadow-sm'
              : 'bg-white/80 backdrop-blur text-slate-400 hover:text-pink-600 hover:bg-white shadow-sm'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-pink-600' : ''}`} />
        </button>
      </div>

      {/* Product Image Stage */}
      <div className="w-full aspect-[4/3] bg-gradient-to-b from-slate-50/70 to-slate-100/50 p-4 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
          loading="lazy"
        />
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category Info */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-700 tracking-wider uppercase mb-1">
            <span>{product.brand}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">{product.category}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-purple-700 transition-colors leading-snug mb-1.5">
            {product.name}
          </h3>

          {/* Key Spec Line */}
          <p className="text-[11px] text-slate-500 line-clamp-1 mb-2 font-mono">
            {getHighlightSpec()}
          </p>

          {/* Star Rating, Inspection & Stock */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded text-[11px] font-bold text-amber-800">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>

            <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3 h-3" />
              <span>40-Pt QC</span>
            </span>
          </div>

          {/* Warranty tag */}
          <div className="text-[10px] text-slate-500 font-medium mb-3 flex items-center gap-1">
            <span className="text-purple-700 font-bold">🛡️ Warranty:</span>
            <span className="truncate">{product.specs.warranty || '1 Year Time4Laptop Comprehensive Warranty'}</span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-slate-100 mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-black text-slate-900 tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] font-bold text-purple-600 ml-auto">
                  {product.discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                inCart
                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  : 'bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300'
              }`}
            >
              {inCart ? (
                <>
                  <Check className="w-3.5 h-3.5 text-purple-700" />
                  <span>In Cart ({cartItem.quantity})</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="py-2 px-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
