import React from 'react';
import { User, MapPin, Package, Heart, LogOut, LayoutDashboard, ShieldCheck, Mail, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AccountPage: React.FC = () => {
  const { currentUser, orders, wishlist, logout, setPage } = useStore();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Please Sign In</h2>
        <p className="text-xs text-slate-500">Sign in to view your profile and saved addresses.</p>
        <button
          onClick={() => setPage('auth')}
          className="px-6 py-2.5 bg-purple-700 text-white rounded-lg text-xs font-bold"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Account</h1>
          <p className="text-xs text-slate-500">Manage profile details, default shipping address and orders</p>
        </div>
        <div className="flex items-center gap-3">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setPage('admin')}
              className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          )}
          <button
            onClick={logout}
            className="px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-2xl">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
              Role: {currentUser.role}
            </span>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-600" />
              <span>{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-600" />
              <span>{currentUser.phone}</span>
            </div>
          </div>
        </div>

        {/* Saved Address Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-700" />
              <span>Default Delivery Address</span>
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">
              Primary Address
            </span>
          </div>

          {currentUser.addresses.map((addr, i) => (
            <div key={i} className="text-xs text-slate-700 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-900">{addr.fullName} ({addr.type})</p>
              <p>{addr.addressLine}</p>
              <p>{addr.city}, {addr.state} - <strong className="font-mono">{addr.pincode}</strong></p>
              <p className="text-slate-500 pt-1">Contact: {addr.phone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Account Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <button
          onClick={() => setPage('orders')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-300 text-left space-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 group-hover:text-purple-700">My Orders</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-[11px] text-slate-500">{orders.length} order history records</p>
        </button>

        <button
          onClick={() => setPage('wishlist')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-300 text-left space-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 group-hover:text-purple-700">Wishlist</span>
            <Heart className="w-4 h-4 text-pink-600" />
          </div>
          <p className="text-[11px] text-slate-500">{wishlist.length} saved products</p>
        </button>

        <button
          onClick={() => setPage('order-tracking')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-300 text-left space-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 group-hover:text-purple-700">Track Shipment</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-[11px] text-slate-500">Live milestones & AWB tracking</p>
        </button>
      </div>
    </div>
  );
};
