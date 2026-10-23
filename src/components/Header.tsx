import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Truck, 
  PhoneCall, 
  Laptop, 
  Smartphone, 
  Gamepad2, 
  Monitor, 
  HardDrive, 
  Headphones, 
  Printer, 
  Cpu, 
  Zap, 
  LayoutDashboard,
  Clock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { ProductCategory } from '../types';

export const Header: React.FC = () => {
  const {
    cartTotalCount,
    wishlist,
    currentUser,
    setPage,
    navigateToCategory,
    navigateToProduct,
    setSearchQuery,
    products,
    logout
  } = useStore();

  const [searchInput, setSearchInput] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for quick search preview
  const searchResults = searchInput.trim()
    ? products
        .filter(p =>
          p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchInput.toLowerCase()) ||
          p.category.toLowerCase().includes(searchInput.toLowerCase()) ||
          Object.values(p.specs).some(val => val?.toLowerCase().includes(searchInput.toLowerCase()))
        )
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      setPage('category');
      setShowSearchDropdown(false);
    }
  };

  const getCategoryIcon = (slug: ProductCategory) => {
    switch (slug) {
      case 'laptops': return <Laptop className="w-4 h-4 text-purple-600" />;
      case 'mobiles': return <Smartphone className="w-4 h-4 text-purple-600" />;
      case 'gaming':
      case 'ps5': return <Gamepad2 className="w-4 h-4 text-purple-600" />;
      case 'monitors': return <Monitor className="w-4 h-4 text-purple-600" />;
      case 'storage': return <HardDrive className="w-4 h-4 text-purple-600" />;
      case 'headphones': return <Headphones className="w-4 h-4 text-purple-600" />;
      case 'printers': return <Printer className="w-4 h-4 text-purple-600" />;
      default: return <Cpu className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-purple-100">
      {/* Top Notification Announcement Bar */}
      <div className="bg-purple-900 text-purple-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-purple-700 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase">
              Special Offer
            </span>
            <span>Use code <strong className="text-white underline">TIME4LAPTOP10</strong> for 10% Instant Discount · Free Delivery Across India</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[11px] text-purple-200">
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-purple-300" />
              <span>Helpline: +91 98765 43210</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-purple-300" />
              <button onClick={() => setPage('order-tracking')} className="hover:text-white transition-colors">
                Track Order
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>100% Genuine Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand & Search Bar Row */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
        {/* Brand Logo Lockup */}
        <button 
          onClick={() => setPage('home')} 
          className="flex items-center gap-2 sm:gap-3 text-left group min-w-0 shrink focus:outline-none"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform shrink-0">
            <Cpu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <span className="block text-lg sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors whitespace-nowrap">
              time4<span className="text-purple-600">laptop</span><span className="hidden xs:inline text-purple-600">.com</span>
            </span>
            <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-slate-500 truncate">
              IT Electronics & Computer Store
            </span>
          </div>
        </button>

        {/* Global Live Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-2xl hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search laptops, RTX graphics, iPhone 16, monitors, RAM, SSD..."
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm rounded-lg border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-md transition-colors shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Dynamic Search Autocomplete Dropdown */}
          {showSearchDropdown && searchInput.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100">
              {searchResults.length > 0 ? (
                <div>
                  <div className="px-4 py-2 bg-purple-50/60 text-xs font-semibold text-purple-900 flex justify-between">
                    <span>Products matching "{searchInput}"</span>
                    <span>{searchResults.length} results</span>
                  </div>
                  {searchResults.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => {
                        navigateToProduct(prod.id);
                        setShowSearchDropdown(false);
                        setSearchInput('');
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-purple-50/50 transition-colors"
                    >
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 object-contain rounded bg-slate-50 p-1 border border-slate-100" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{prod.name}</p>
                        <p className="text-[11px] text-slate-500">{prod.brand} · {prod.category.toUpperCase()}</p>
                      </div>
                      <span className="text-xs font-bold text-purple-700 tabular-nums">₹{prod.price.toLocaleString('en-IN')}</span>
                    </button>
                  ))}
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full py-2.5 text-center text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    View all results for "{searchInput}" →
                  </button>
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-slate-500">
                  <p>No products found for "{searchInput}"</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching for "MacBook", "RTX", "PS5", or "Dell"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Icons: Wishlist, Account, Cart, Menu */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Wishlist Button */}
          <button
            onClick={() => setPage('wishlist')}
            className="p-1.5 sm:px-3 sm:py-2 text-slate-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg flex items-center gap-2 transition-colors relative"
            title="My Wishlist"
          >
            <div className="relative">
              <Heart className="w-5 h-5 text-slate-700" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span className="hidden lg:inline text-xs font-semibold">Wishlist</span>
          </button>

          {/* User Account Dropdown */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="p-1.5 sm:px-3 sm:py-2 text-slate-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg flex items-center gap-2 transition-colors"
            >
              <User className="w-5 h-5 text-slate-700" />
              <div className="hidden lg:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-slate-500">Welcome</span>
                <span className="text-xs font-semibold truncate max-w-[90px]">
                  {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                {currentUser ? (
                  <>
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded">
                        {currentUser.role.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => { setPage('account'); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => { setPage('orders'); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={() => { setPage('order-tracking'); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                    >
                      Track Shipment
                    </button>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => { setPage('admin'); setShowUserDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-purple-700 font-semibold hover:bg-purple-50 flex items-center gap-1.5"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Admin Dashboard
                      </button>
                    )}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setShowUserDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 border-b border-slate-100">
                      <button
                        onClick={() => { setPage('auth'); setShowUserDropdown(false); }}
                        className="w-full py-2 bg-purple-700 text-white rounded-lg text-xs font-semibold text-center hover:bg-purple-800 shadow-sm"
                      >
                        Login / Register
                      </button>
                    </div>
                    <button
                      onClick={() => { setPage('orders'); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-purple-50"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={() => { setPage('order-tracking'); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-purple-50"
                    >
                      Track Order
                    </button>
                    <button
                      onClick={() => { setPage('admin'); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-purple-700 font-bold hover:bg-purple-50 flex items-center gap-1.5 border-t border-slate-100 mt-1 pt-2"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Admin Dashboard
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart Icon & Live Counter Button */}
          <button
            onClick={() => setPage('cart')}
            className="p-1.5 sm:px-3 sm:py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg flex items-center gap-2 transition-colors border border-purple-200/60 shrink-0"
            title="Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-purple-700" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-purple-700 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-sm">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-[10px] text-purple-600 font-medium uppercase tracking-wider">Cart</span>
              <span className="text-xs font-bold text-slate-900">{cartTotalCount} Items</span>
            </div>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg shrink-0"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Secondary Sticky Navigation Bar with Mega Menu */}
      <nav className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-xs font-semibold text-slate-700">
            {/* All Categories Dropdown Trigger */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition-colors shadow-sm"
              >
                <Menu className="w-4 h-4" />
                <span>All Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Mega Categories Menu */}
              {showCategoryMenu && (
                <div 
                  onMouseLeave={() => setShowCategoryMenu(false)}
                  className="absolute left-0 top-full mt-1 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 divide-y divide-slate-100"
                >
                  <div className="px-4 py-2 bg-purple-50 text-[11px] font-bold text-purple-800 uppercase tracking-wider">
                    Browse All IT Departments
                  </div>
                  <div className="max-h-[420px] overflow-y-auto">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => {
                          navigateToCategory(cat.slug);
                          setShowCategoryMenu(false);
                        }}
                        className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-purple-50/80 transition-colors text-slate-800 hover:text-purple-800 group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="p-1.5 rounded-md bg-purple-50 group-hover:bg-white text-purple-600 transition-colors">
                            {getCategoryIcon(cat.slug)}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700">{cat.name}</p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[170px]">{cat.shortDesc}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-100/60 px-1.5 py-0.5 rounded">
                          {cat.itemCount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <button
              onClick={() => setPage('home')}
              className="px-3 py-2 rounded-lg hover:text-purple-700 hover:bg-purple-50 transition-colors whitespace-nowrap"
            >
              Home
            </button>
            <button
              onClick={() => navigateToCategory('laptops')}
              className="px-3 py-2 rounded-lg hover:text-purple-700 hover:bg-purple-50 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Laptop className="w-3.5 h-3.5 text-purple-600" />
              Laptops
            </button>
            <button
              onClick={() => navigateToCategory('mobiles')}
              className="px-3 py-2 rounded-lg hover:text-purple-700 hover:bg-purple-50 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5 text-purple-600" />
              Mobiles
            </button>
            <button
              onClick={() => navigateToCategory('gaming')}
              className="px-3 py-2 rounded-lg hover:text-purple-700 hover:bg-purple-50 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-purple-600" />
              Gaming Zone
            </button>
            <button
              onClick={() => navigateToCategory('ps5')}
              className="px-3 py-2 rounded-lg hover:text-purple-700 hover:bg-purple-50 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-purple-600" />
              PS5 & Consoles
            </button>
            <button
              onClick={() => navigateToCategory('monitors')}
              className="px-3 py-2 rounded-lg hover:text-purple-700 hover:bg-purple-50 transition-colors whitespace-nowrap"
            >
              Monitors
            </button>
            <button
              onClick={() => navigateToCategory('storage')}
              className="px-3 py-2 rounded-lg hover:text-purple-700 hover:bg-purple-50 transition-colors whitespace-nowrap"
            >
              Storage & RAM
            </button>
            <button
              onClick={() => navigateToCategory('accessories')}
              className="px-3 py-2 rounded-lg hover:text-purple-700 hover:bg-purple-50 transition-colors whitespace-nowrap"
            >
              Accessories
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setPage('admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-lg">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search IT products..."
              className="w-full pl-9 pr-16 py-2 bg-slate-100 text-sm rounded-lg border border-slate-200 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <button
              type="submit"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-purple-700 text-white text-xs font-semibold rounded"
            >
              Go
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <button
              onClick={() => { setPage('home'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg bg-slate-50 text-left hover:bg-purple-50"
            >
              🏠 Home
            </button>
            <button
              onClick={() => { navigateToCategory('laptops'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg bg-slate-50 text-left hover:bg-purple-50"
            >
              💻 Laptops (15+)
            </button>
            <button
              onClick={() => { navigateToCategory('mobiles'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg bg-slate-50 text-left hover:bg-purple-50"
            >
              📱 Mobiles (15+)
            </button>
            <button
              onClick={() => { navigateToCategory('gaming'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg bg-slate-50 text-left hover:bg-purple-50"
            >
              ⚡ Gaming Rigs
            </button>
            <button
              onClick={() => { navigateToCategory('ps5'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg bg-slate-50 text-left hover:bg-purple-50"
            >
              🎮 PS5 & Consoles
            </button>
            <button
              onClick={() => { navigateToCategory('monitors'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg bg-slate-50 text-left hover:bg-purple-50"
            >
              🖥️ Monitors
            </button>
            <button
              onClick={() => { navigateToCategory('storage'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg bg-slate-50 text-left hover:bg-purple-50"
            >
              💾 Storage & RAM
            </button>
            <button
              onClick={() => { navigateToCategory('accessories'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg bg-slate-50 text-left hover:bg-purple-50"
            >
              🔌 Accessories
            </button>
            <button
              onClick={() => { setPage('order-tracking'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg bg-purple-50 text-purple-700 text-left font-bold"
            >
              📦 Track Order
            </button>
            <button
              onClick={() => { setPage('admin'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg bg-purple-700 text-white text-left font-bold"
            >
              ⚙️ Admin Panel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
