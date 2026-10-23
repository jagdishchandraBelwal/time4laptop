import React from 'react';
import { useStore } from '../context/StoreContext';
import { LayoutDashboard, ShoppingBag, ShieldCheck, UserCheck, ArrowRight, Sparkles } from 'lucide-react';

export const ViewModeBar: React.FC = () => {
  const { currentUser, page, setPage, loginAsDemoAdmin, logout } = useStore();

  const isAdmin = currentUser?.role === 'admin';
  const isAdminPage = page === 'admin';

  const switchToAdmin = () => {
    if (!isAdmin) {
      loginAsDemoAdmin();
    }
    setPage('admin');
  };

  const switchToCustomer = () => {
    setPage('home');
  };

  return (
    <div className="bg-slate-950 text-white text-[11px] px-3 sm:px-4 py-1.5 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Current Mode Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAdminPage ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isAdminPage ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          </span>
          <span className="text-slate-400">Current View:</span>
          {isAdminPage ? (
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Operations Portal (Store Manager View)</span>
            </span>
          ) : (
            <span className="font-bold text-emerald-300 flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Customer Storefront (Buyer / Shopper View)</span>
            </span>
          )}
        </div>

        {/* Center: Live Refurbished Value Tag */}
        <div className="hidden lg:flex items-center gap-2 text-slate-300 font-medium">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Refurbished Laptops, Mobiles & Consoles with 40-Point QC & 1-Year Warranty</span>
        </div>

        {/* Right: One-Click Toggle Button */}
        <div className="flex items-center gap-2">
          {isAdminPage ? (
            <button
              onClick={switchToCustomer}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-md flex items-center gap-1.5 transition shadow-sm hover:scale-105 active:scale-95"
              title="Switch to customer facing storefront"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Switch to Customer Storefront 🛍️</span>
            </button>
          ) : (
            <button
              onClick={switchToAdmin}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-md flex items-center gap-1.5 transition shadow-sm hover:scale-105 active:scale-95"
              title="Open the administrative operations portal"
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>Switch to Admin Portal ⚙️</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
