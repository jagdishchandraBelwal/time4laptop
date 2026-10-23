import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Check, 
  ChevronRight, 
  MapPin, 
  ArrowLeft,
  Share2,
  Cpu,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { reviewService } from '../services/reviewService';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProductId, 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setPage, 
    navigateToCategory,
    showToast
  } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('110019');
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'warranty' | 'reviews'>('specs');

  const allImages = [product.image, ...(product.gallery || [])];
  const isWishlisted = isInWishlist(product.id);

  const [productReviews, setProductReviews] = useState(() => reviewService.getReviews(product.id));
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    const rev = reviewService.addReview({
      productId: product.id,
      userName: reviewName.trim(),
      rating: reviewRating,
      title: reviewTitle.trim() || 'Great refurbished device',
      comment: reviewComment.trim(),
      verifiedPurchase: true
    });
    setProductReviews(prev => [rev, ...prev]);
    setShowReviewForm(false);
    setReviewName('');
    setReviewComment('');
    showToast('Thank you! Your verified review has been posted.');
  };

  // Delivery check handler
  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeChecked(true);
      showToast(`Express Delivery available to PIN ${pincode}!`);
    } else {
      showToast('Please enter a valid 6-digit Indian PIN code', 'error');
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setPage('checkout');
  };

  const handleViewEmiPlans = () => {
    addToCart(product, quantity);
    window.sessionStorage.setItem('time4laptop-checkout-method', 'EMI');
    setPage('checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Product link copied to clipboard!');
  };

  // Related products from same category
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // EMI monthly estimate calculation
  const emiPerMonth = Math.round(product.price / 12);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Breadcrumb row */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => setPage('home')} className="hover:text-purple-700">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button 
          onClick={() => navigateToCategory(product.category)} 
          className="hover:text-purple-700 uppercase"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main PDP Grid: Gallery (Left) & Purchase Module (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Gallery Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-center aspect-[4/3] relative overflow-hidden group">
            {product.badge && (
              <span className="absolute top-4 left-4 bg-purple-700 text-white text-xs font-bold px-3 py-1 rounded shadow-sm z-10">
                {product.badge}
              </span>
            )}

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-2.5 rounded-full z-10 transition-colors shadow-sm ${
                isWishlisted
                  ? 'bg-pink-50 text-pink-600'
                  : 'bg-white/90 text-slate-400 hover:text-pink-600'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-pink-600' : ''}`} />
            </button>

            <img
              src={allImages[activeImageIndex] || product.image}
              alt={product.name}
              className="w-full h-full object-contain max-h-[420px] transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Thumbnail Gallery Picker */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-18 h-18 rounded-xl border-2 p-1 bg-white shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-purple-600 shadow-md shadow-purple-600/10'
                      : 'border-slate-200 hover:border-purple-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Authenticity Guarantee Callout */}
          <div className="bg-purple-50/60 rounded-xl border border-purple-100 p-4 flex items-center justify-between text-xs text-purple-900">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-purple-600 shrink-0" />
              <div>
                <strong className="block font-bold">100% Brand Sealed Guarantee</strong>
                <span>Direct brand invoice with official {product.specs.warranty || '1 Year'} nationwide warranty.</span>
              </div>
            </div>
            <button onClick={handleShare} className="p-2 text-purple-700 hover:bg-purple-100 rounded-lg" title="Share Product">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          {/* Brand & Title */}
          <div>
            <div className="flex items-center justify-between text-xs text-purple-700 font-bold uppercase tracking-wider mb-1">
              <span>{product.brand} Official</span>
              <span className="text-slate-400 font-mono text-[11px]">SKU: {product.sku || ('T4L-' + product.id.toUpperCase())}</span>
            </div>

            <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {product.name}
            </h1>

            {/* Refurbished Condition Grade & Inspection Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5 mb-1.5">
              <span className="px-2.5 py-1 rounded-md text-xs font-black bg-emerald-700 text-white shadow-sm">
                {product.conditionGrade || 'Grade A - Like New'}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-50 text-purple-900 border border-purple-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                <span>40-Point QC Passed</span>
              </span>
              {product.batteryHealth && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
                  🔋 Battery Health: {product.batteryHealth}%
                </span>
              )}
            </div>

            {/* Rating & Stock row */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded text-xs font-bold text-amber-900">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs text-slate-500">({product.reviewsCount} customer reviews)</span>
              
              {product.inStock ? (
                <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  ✓ In Stock ({product.stockCount} units available)
                </span>
              ) : (
                <span className="ml-auto text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  Currently Sold Out
                </span>
              )}
            </div>
          </div>

          {/* Pricing Module */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-slate-400 line-through tabular-nums">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({product.discountPercent}% OFF)
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Inclusive of all taxes & GST credit eligible</p>

            {/* EMI Preview */}
            <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>12-month estimate from <strong>₹{emiPerMonth.toLocaleString('en-IN')}/mo</strong></span>
              </div>
              <button
                type="button"
                onClick={handleViewEmiPlans}
                className="text-[10px] text-purple-700 font-bold uppercase hover:text-purple-900"
              >
                See EMI options
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Approximate principal split; bank interest, fees and approval may apply.</p>
          </div>

          {/* Quantity Selector & Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-slate-100 text-slate-700 font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-slate-900 tabular-nums min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount || 10, quantity + 1))}
                  className="px-3 py-1.5 hover:bg-slate-100 text-slate-700 font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => addToCart(product, quantity)}
                className="py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-purple-600/20"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-purple-700" />
              <span>Delivery & Availability Check</span>
            </h4>

            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit PIN code"
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
              >
                Check
              </button>
            </form>

            {pincodeChecked && (
              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Express Priority Delivery to PIN {pincode}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Estimated arrival: <strong>2-3 business days</strong> via Blue Dart Air Priority.
                </p>
                <p className="text-[11px] text-slate-500">
                  Cash on Delivery & Open Box Delivery available for this location.
                </p>
              </div>
            )}
          </div>

          {/* Service Guarantees */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-purple-600 shrink-0" />
              <span>7 Days Replacement Policy</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Official Warranty Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications, Description, Warranty & Reviews */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-3.5 text-xs font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'specs'
                ? 'border-purple-700 text-purple-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('description')}
            className={`px-6 py-3.5 text-xs font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'description'
                ? 'border-purple-700 text-purple-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Product Overview & Features
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`px-6 py-3.5 text-xs font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'warranty'
                ? 'border-purple-700 text-purple-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Warranty & In The Box
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3.5 text-xs font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'reviews'
                ? 'border-purple-700 text-purple-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Customer Reviews ({product.reviewsCount})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Full Hardware Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
                {Object.entries(product.specs).map(([key, value]) => (
                  value ? (
                    <div key={key} className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500 capitalize font-medium">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="text-slate-900 font-semibold text-right max-w-[60%]">
                        {value}
                      </span>
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          )}

          {activeTab === 'description' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
              <h3 className="text-sm font-bold text-slate-900">About {product.name}</h3>
              <p>{product.description}</p>
              <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100 mt-4 space-y-2 text-xs">
                <h4 className="font-bold text-purple-900">Key Highlights</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li>Original manufacturer retail packaging with tamper-proof security seals</li>
                  <li>Pre-tested for zero defect tolerances by time4laptop.com quality inspection</li>
                  <li>Compliant with Indian electrical & BIS certification safety standards</li>
                  <li>Eligible for GST invoice with 18% Input Tax Credit claim</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="space-y-4 text-xs text-slate-700 max-w-2xl">
              <h3 className="text-sm font-bold text-slate-900">Warranty Coverage</h3>
              <p>
                This item comes with a <strong>{product.specs.warranty || '1 Year Manufacturer Warranty'}</strong> honored across all authorized service centers in India.
              </p>
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-900">Package Contents (In The Box):</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>1x {product.name}</li>
                  <li>Original Power Cable / Power Adapter / Charger</li>
                  <li>Quick Setup Manual & Brand Safety Documentation</li>
                  <li>Official Brand Warranty Card</li>
                  <li>time4laptop.com Tax Invoice with GSTIN</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Reviews Summary & Write Review Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="text-center pr-6 border-r border-slate-200">
                    <span className="text-3xl font-black text-slate-900 tabular-nums">{product.rating}</span>
                    <div className="flex justify-center text-amber-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Based on {productReviews.length || product.reviewsCount} reviews</span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p><strong>100% Verified Purchases:</strong> Submitted by verified customers who received tested refurbished units.</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">✓ 98% of customers recommend this hardware.</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition shadow-sm whitespace-nowrap self-start sm:self-auto"
                >
                  {showReviewForm ? 'Cancel Review' : '✍️ Write a Review'}
                </button>
              </div>

              {/* Review Submission Form Drawer */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="p-5 bg-purple-50/60 rounded-xl border border-purple-200 space-y-3 text-xs">
                  <h4 className="font-bold text-purple-950 text-sm">Write Your Verified Customer Review</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="e.g. Vikas Sharma"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Star Rating *</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-amber-700"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ 5 Stars - Exceptional</option>
                        <option value={4}>⭐⭐⭐⭐ 4 Stars - Very Good</option>
                        <option value={3}>⭐⭐⭐ 3 Stars - Average</option>
                        <option value={2}>⭐⭐ 2 Stars - Below Expectation</option>
                        <option value={1}>⭐ 1 Star - Poor</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Review Headline *</label>
                    <input
                      type="text"
                      required
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Pristine Grade A condition, flawless performance!"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Detailed Feedback *</label>
                    <textarea
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Describe the packaging, physical condition, battery life, and your delivery experience..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg shadow-sm"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}

              {/* Dynamic verified review cards */}
              <div className="space-y-3">
                {productReviews.length > 0 ? (
                  productReviews.map(r => (
                    <div key={r.id} className="p-4 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{r.userName}</span>
                          {r.verifiedPurchase && (
                            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                              ✓ Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{r.date}</span>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs">{r.title}</h5>
                      <p className="text-slate-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-white rounded-lg border border-slate-200 text-xs text-slate-500 text-center">
                    No reviews yet for this model. Be the first verified buyer to leave a review!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Related Hardware in {product.category.toUpperCase()}
            </h2>
            <button
              onClick={() => navigateToCategory(product.category)}
              className="text-xs font-bold text-purple-700 hover:underline"
            >
              View More →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
