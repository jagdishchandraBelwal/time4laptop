import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  X, 
  ChevronDown, 
  SlidersHorizontal, 
  Star, 
  Search, 
  Check, 
  Laptop, 
  Smartphone, 
  RotateCcw,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, TOP_BRANDS } from '../data/products';
import { ProductCategory, ConditionGrade } from '../types';

export const CatalogPage: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    navigateToCategory, 
    searchQuery, 
    setSearchQuery 
  } = useStore();

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(400000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedRam, setSelectedRam] = useState<string>('all');
  const [selectedStorage, setSelectedStorage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available brands in the current category
  const categoryProducts = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.conditionGrade && p.conditionGrade.toLowerCase().includes(q)) ||
        Object.values(p.specs).some(s => s?.toLowerCase().includes(q))
      );
    }
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory, searchQuery]);

  const availableBrands = useMemo(() => {
    return Array.from(new Set(categoryProducts.map(p => p.brand))).sort();
  }, [categoryProducts]);

  // Filter application
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter(p => {
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      // Condition Grade filter
      if (selectedCondition !== 'all') {
        const itemCondition = p.conditionGrade || 'Grade A - Like New';
        if (!itemCondition.toLowerCase().includes(selectedCondition.toLowerCase())) {
          return false;
        }
      }
      // Price filter
      if (p.price > maxPrice) {
        return false;
      }
      // Rating filter
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }
      // In stock
      if (inStockOnly && !p.inStock) {
        return false;
      }
      // RAM filter
      if (selectedRam !== 'all' && (!p.specs.ram || !p.specs.ram.includes(selectedRam))) {
        return false;
      }
      // Storage filter
      if (selectedStorage !== 'all' && (!p.specs.storage || !p.specs.storage.includes(selectedStorage))) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      return 0; // default featured
    });
  }, [categoryProducts, selectedBrands, selectedCondition, maxPrice, minRating, inStockOnly, selectedRam, selectedStorage, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCondition('all');
    setMaxPrice(400000);
    setMinRating(0);
    setInStockOnly(false);
    setSelectedRam('all');
    setSelectedStorage('all');
    setSortBy('featured');
    if (searchQuery) setSearchQuery('');
  };

  const currentCategoryInfo = CATEGORIES.find(c => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Category Header Banner with Refurbished Assurance */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-800/80 text-purple-200 text-[11px] font-bold border border-purple-700/60">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Certified Refurbished & Verified Hardware</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {searchQuery ? `Search results for "${searchQuery}"` : currentCategoryInfo?.name || 'Refurbished Electronics'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200">
            {searchQuery 
              ? `Found ${filteredProducts.length} verified refurbished devices matching your search.`
              : currentCategoryInfo?.shortDesc || 'Tested on 40+ hardware parameters with genuine brand warranty.'
            }
          </p>
        </div>

        {/* 40-Point QC stamp watermark */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-xs font-bold">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>40-Point Inspection Passed</span>
        </div>
      </div>

      {/* Control Bar: Filters count, Mobile Toggle & Sorting */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 font-bold text-xs rounded-lg border border-purple-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters ({selectedBrands.length + (selectedCondition !== 'all' ? 1 : 0)})</span>
          </button>

          <span className="text-xs font-semibold text-slate-500">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> verified devices
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-purple-600 shadow-sm"
          >
            <option value="featured">Featured / Best Sellers</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Customer Rating</option>
            <option value="discount">Biggest Discount %</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block bg-white rounded-xl border border-slate-200 p-5 space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-700" />
              <h3 className="text-sm font-bold text-slate-900">Filters</h3>
            </div>
            {(selectedBrands.length > 0 || selectedCondition !== 'all' || maxPrice < 400000 || minRating > 0 || inStockOnly || selectedRam !== 'all' || selectedStorage !== 'all') && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-800 hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Refurbished Condition Grade Filter */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Condition Grade</span>
              <span className="text-[10px] text-purple-700 font-semibold">Refurbished</span>
            </h4>
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'all', label: 'All Condition Grades' },
                { id: 'Grade A', label: 'Grade A (Like New)', desc: 'Zero/minimal wear' },
                { id: 'Grade B', label: 'Grade B (Excellent)', desc: 'Light micro-marks' },
                { id: 'Grade C', label: 'Grade C (Good Value)', desc: 'Budget friendly' }
              ].map(cond => (
                <label
                  key={cond.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border transition-colors ${
                    selectedCondition === cond.id
                      ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold'
                      : 'border-transparent text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="conditionGrade"
                      checked={selectedCondition === cond.id}
                      onChange={() => setSelectedCondition(cond.id)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span>{cond.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Department / Category Switcher */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Categories
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => navigateToCategory(cat.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedCategory === cat.slug && !searchQuery
                      ? 'bg-purple-100/70 text-purple-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-slate-400 tabular-nums">{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          {availableBrands.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Brands
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {availableBrands.map(brand => (
                  <label
                    key={brand}
                    className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-purple-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider">Max Price</span>
              <span className="font-bold text-purple-700 tabular-nums">
                ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="400000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-purple-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹500</span>
              <span>₹4,00,000</span>
            </div>
          </div>

          {/* Stock Availability */}
          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No hardware found matching your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing selected brands or adjusting the condition grade and price range.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg text-xs font-bold hover:bg-purple-800 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
