import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  Smartphone, 
  Gamepad2, 
  Monitor, 
  HardDrive, 
  Headphones, 
  ShieldCheck, 
  Truck, 
  Clock, 
  ArrowRight, 
  Zap, 
  Star, 
  CheckCircle, 
  Award,
  ChevronRight,
  Flame,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, TOP_BRANDS } from '../data/products';
import { ProductCategory } from '../types';

export const HomePage: React.FC = () => {
  const { 
    products, 
    navigateToCategory, 
    navigateToProduct, 
    setPage 
  } = useStore();

  // Deal of the Day countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered collections
  const featuredLaptops = products.filter(p => p.category === 'laptops').slice(0, 4);
  const trendingMobiles = products.filter(p => p.category === 'mobiles').slice(0, 4);
  const gamingHighlights = products.filter(p => p.category === 'gaming').slice(0, 4);
  const consoleHighlights = products.filter(p => p.category === 'ps5').slice(0, 4);
  const bestSellers = products.filter(p => p.bestSeller).slice(0, 8);

  const dealProduct = products.find(p => p.id === 'lap-03') || products[0];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 text-white rounded-2xl mx-4 sm:mx-6 lg:mx-auto max-w-7xl mt-4 sm:mt-6 p-6 sm:p-10 lg:p-14 shadow-2xl border border-purple-500/20">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/80 border border-purple-500/40 text-purple-200 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>India's Most Trusted IT Electronics Store</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-200">Laptops, Gaming & IT Gear</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Equip your workstation with 100% genuine hardware from Apple, ASUS ROG, HP, Sony PS5, and NVIDIA. Unmatched Indian pricing with free express delivery.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigateToCategory('laptops')}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
              >
                <span>Shop Laptops</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateToCategory('gaming')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 flex items-center gap-2 transition-all hover:bg-white/20"
              >
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Gaming Zone</span>
              </button>

              <button
                onClick={() => navigateToCategory('ps5')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 flex items-center gap-2 transition-all hover:bg-white/20"
              >
                <Gamepad2 className="w-4 h-4 text-purple-400" />
                <span>PS5 Consoles</span>
              </button>
            </div>

            {/* Micro Trust Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-purple-500/20 text-xs text-slate-300">
              <div>
                <strong className="block text-lg font-bold text-white tabular-nums">50,000+</strong>
                <span className="text-slate-400">Happy Customers</span>
              </div>
              <div>
                <strong className="block text-lg font-bold text-white tabular-nums">100%</strong>
                <span className="text-slate-400">Genuine Brand Warranty</span>
              </div>
              <div>
                <strong className="block text-lg font-bold text-white tabular-nums">4.9 / 5</strong>
                <span className="text-slate-400">Google Review Score</span>
              </div>
            </div>
          </div>

          {/* Deal Showcase Card on Hero */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 backdrop-blur border border-purple-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[11px] rounded uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  Deal of the Day
                </span>
                
                {/* Live Countdown Clock */}
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-purple-300">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded text-white">{String(timeLeft.hours).padStart(2, '0')}</span>:
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>:
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Deal Product Preview */}
              <div 
                onClick={() => navigateToProduct(dealProduct.id)}
                className="cursor-pointer group flex items-center gap-4 bg-slate-800/60 p-3 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <div className="w-24 h-24 bg-slate-800 rounded-lg p-2 shrink-0 flex items-center justify-center">
                  <img src={dealProduct.image} alt={dealProduct.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-[10px] text-purple-400 font-bold uppercase">{dealProduct.brand}</span>
                  <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {dealProduct.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-base font-black text-white tabular-nums">
                      ₹{dealProduct.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 line-through tabular-nums">
                      ₹{dealProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-400">
                    Save ₹{(dealProduct.originalPrice - dealProduct.price).toLocaleString('en-IN')} ({dealProduct.discountPercent}% OFF)
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigateToProduct(dealProduct.id)}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center"
              >
                Claim Deal Before Timer Expires →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Icons Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs text-slate-500">Explore complete IT hardware, consoles and components</p>
          </div>
          <button
            onClick={() => navigateToCategory('laptops')}
            className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.slice(0, 12).map((cat) => (
            <button
              key={cat.slug}
              onClick={() => navigateToCategory(cat.slug)}
              className="group p-4 bg-white rounded-xl border border-slate-200/80 hover:border-purple-400 hover:shadow-md hover:shadow-purple-600/5 transition-all text-center flex flex-col items-center justify-center space-y-2.5"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 group-hover:bg-purple-600 text-purple-700 group-hover:text-white flex items-center justify-center transition-colors">
                {cat.slug === 'laptops' && <Laptop className="w-6 h-6" />}
                {cat.slug === 'mobiles' && <Smartphone className="w-6 h-6" />}
                {cat.slug === 'gaming' && <Zap className="w-6 h-6" />}
                {cat.slug === 'ps5' && <Gamepad2 className="w-6 h-6" />}
                {cat.slug === 'monitors' && <Monitor className="w-6 h-6" />}
                {cat.slug === 'storage' && <HardDrive className="w-6 h-6" />}
                {cat.slug === 'headphones' && <Headphones className="w-6 h-6" />}
                {!['laptops', 'mobiles', 'gaming', 'ps5', 'monitors', 'storage', 'headphones'].includes(cat.slug) && (
                  <Tag className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">
                  {cat.itemCount} Products
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Laptops Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <Laptop className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Featured Flagship Laptops
              </h2>
              <p className="text-xs text-slate-500">15+ high-performance models from Apple, ASUS, Dell, HP & Lenovo</p>
            </div>
          </div>

          <button
            onClick={() => navigateToCategory('laptops')}
            className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1"
          >
            <span>Explore All 15+ Laptops</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredLaptops.map(laptop => (
            <ProductCard key={laptop.id} product={laptop} />
          ))}
        </div>
      </section>

      {/* Mobiles Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <Smartphone className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Trending Smartphones & Flagships
              </h2>
              <p className="text-xs text-slate-500">15+ smartphones with 5G, ZEISS & Leica cameras, ultra-fast charging</p>
            </div>
          </div>

          <button
            onClick={() => navigateToCategory('mobiles')}
            className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1"
          >
            <span>Explore All 15+ Mobiles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingMobiles.map(mob => (
            <ProductCard key={mob.id} product={mob} />
          ))}
        </div>
      </section>

      {/* Gaming Zone & Custom Rigs Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-purple-800/40 p-6 sm:p-10 text-white">
          <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-purple-900/40 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="px-2.5 py-1 bg-purple-700 text-white text-[11px] font-bold rounded uppercase tracking-wider">
                Time4Laptop Custom Battlestations
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Ultra-Tier Liquid Cooled PC Rigs with NVIDIA RTX 4090
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Custom built by master technicians in Nehru Place. Hand-tuned for esports and 4K ray tracing with 3 years comprehensive onsite warranty.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => navigateToCategory('gaming')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Browse Gaming Hardware
              </button>
              <button
                onClick={() => navigateToCategory('ps5')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all"
              >
                PS5 & Console Hub
              </button>
            </div>
          </div>
        </div>

        {/* Gaming & Console Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {gamingHighlights.map(g => (
            <ProductCard key={g.id} product={g} />
          ))}
        </div>
      </section>

      {/* PS5 & Consoles Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                PlayStation 5, Xbox & Consoles
              </h2>
              <p className="text-xs text-slate-500">Official Sony PlayStation India stock, DualSense controllers and blockbuster games</p>
            </div>
          </div>

          <button
            onClick={() => navigateToCategory('ps5')}
            className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1"
          >
            <span>View All Consoles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {consoleHighlights.map(c => (
            <ProductCard key={c.id} product={c} />
          ))}
        </div>
      </section>

      {/* Top Brands Marquee / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 bg-purple-50/50 rounded-2xl border border-purple-100">
        <div className="text-center max-w-xl mx-auto mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-purple-900">
            Authorized Partner for World-Leading Tech Brands
          </h2>
          <p className="text-xs text-slate-500 mt-1">Direct warranty support and official Indian distributor stock</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {TOP_BRANDS.map(brand => (
            <button
              key={brand}
              onClick={() => {
                navigateToCategory('laptops');
              }}
              className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-800 hover:border-purple-600 hover:text-purple-700 transition-colors shadow-sm"
            >
              {brand}
            </button>
          ))}
        </div>
      </section>

      {/* Why Choose time4laptop.com */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">The time4laptop.com Difference</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Why 50,000+ Customers Buy From Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">100% Brand Sealed & Verified</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Zero refurbished or gray-market items. Every product carries original serial numbers valid for brand service centers across India.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Air Express Priority Shipping</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dispatched from our centralized hubs with multi-layer tamper-evident bubble and foam packaging. Same-day dispatch on orders before 2 PM.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">GST Input Credit for Businesses</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your company GSTIN at checkout to receive automated B2B tax invoices with 18% input tax credit eligibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Verified Customer Reviews
            </h2>
            <p className="text-xs text-slate-500">Real feedback from IT professionals, gamers and students</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>4.9 / 5 Overall Satisfaction</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "Purchased the ASUS ROG Strix G16 from time4laptop.com. Delivery to Bengaluru took only 48 hours via Blue Dart! Sealed pack with genuine ASUS India warranty registered in my name instantly."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <strong className="block text-slate-900">Vikramaditya Rao</strong>
                <span className="text-[11px] text-slate-400">Software Architect, Bengaluru</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Verified Buyer</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "Got the PS5 Slim Disc Edition with Spider-Man 2. The packaging had triple-layer protection. Best prices compared to offline stores in Nehru Place. Highly recommend time4laptop.com!"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <strong className="block text-slate-900">Ananya Sen</strong>
                <span className="text-[11px] text-slate-400">Content Creator, New Delhi</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Verified Buyer</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "Ordered Samsung 990 Pro 2TB SSD and Keychron K2 keyboard for my home studio. Superfast dispatch and coupon TIME4LAPTOP10 gave a nice instant discount. Fantastic support team."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <strong className="block text-slate-900">Rohan Kulkarni</strong>
                <span className="text-[11px] text-slate-400">Game Developer, Pune</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Verified Buyer</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
