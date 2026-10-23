import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Package, 
  Heart, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Plus, 
  Edit2, 
  Trash2, 
  Star, 
  Check, 
  X,
  CheckCircle2,
  Building,
  Home
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UserAddress } from '../types';

const INDIAN_STATES = [
  'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 
  'Uttar Pradesh', 'West Bengal', 'Telangana', 'Rajasthan', 'Kerala', 
  'Haryana', 'Punjab', 'Madhya Pradesh', 'Bihar', 'Andhra Pradesh', 'Odisha', 'Assam'
];

export const AccountPage: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    wishlist, 
    logout, 
    setPage, 
    updateProfile, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress,
    loginAsDemoAdmin
  } = useStore();

  // Profile Edit Modal / Form State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrFullName, setAddrFullName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('Delhi');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrType, setAddrType] = useState<'Home' | 'Work'>('Home');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 mx-auto flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Please Sign In</h2>
        <p className="text-xs text-slate-500">Sign in to manage your profile details, default shipping addresses, and order history.</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <button
            onClick={() => setPage('auth')}
            className="px-6 py-2.5 bg-purple-700 text-white rounded-xl text-xs font-bold hover:bg-purple-800 transition"
          >
            Go to Sign In
          </button>
          <button
            onClick={() => loginAsDemoAdmin()}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
          >
            Preview with Test Account
          </button>
        </div>
      </div>
    );
  }

  const handleOpenEditProfile = () => {
    setProfileName(currentUser.name);
    setProfilePhone(currentUser.phone);
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    await updateProfile({
      name: profileName.trim(),
      phone: profilePhone.trim()
    });
    setIsEditProfileOpen(false);
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrFullName(currentUser.name);
    setAddrPhone(currentUser.phone);
    setAddrLine('');
    setAddrCity('');
    setAddrState('Delhi');
    setAddrPincode('');
    setAddrType('Home');
    setAddrIsDefault(currentUser.addresses.length === 0);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: UserAddress) => {
    setEditingAddressId(addr.id || null);
    setAddrFullName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrLine(addr.addressLine);
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrPincode(addr.pincode);
    setAddrType(addr.type);
    setAddrIsDefault(!!addr.isDefault);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrFullName.trim() || !addrLine.trim() || !addrCity.trim() || !addrPincode.trim()) return;

    if (editingAddressId) {
      await updateAddress(editingAddressId, {
        fullName: addrFullName.trim(),
        phone: addrPhone.trim(),
        addressLine: addrLine.trim(),
        city: addrCity.trim(),
        state: addrState,
        pincode: addrPincode.trim(),
        type: addrType,
        isDefault: addrIsDefault
      });
    } else {
      await addAddress({
        fullName: addrFullName.trim(),
        phone: addrPhone.trim(),
        addressLine: addrLine.trim(),
        city: addrCity.trim(),
        state: addrState,
        pincode: addrPincode.trim(),
        type: addrType,
        isDefault: addrIsDefault
      });
    }
    setIsAddressModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Customer Account</h1>
          <p className="text-xs text-slate-500">Manage your profile information, delivery addresses, and past order history</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-purple-600/20">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleOpenEditProfile}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition border border-purple-200"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                currentUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                Role: {currentUser.role}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">ID: #{currentUser.id.slice(-6)}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="truncate">{currentUser.email || 'customer@time4laptop.com'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-purple-600 shrink-0" />
              <span>{currentUser.phone || '+91 Not provided'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Email & Phone Verified Account</span>
            </div>
          </div>
        </div>

        {/* Right Column: Saved Delivery Addresses (2 cols) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-700" />
                <span>Saved Delivery Addresses ({currentUser.addresses.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Manage addresses for fast 1-click doorstep checkout</p>
            </div>

            <button
              onClick={handleOpenAddAddress}
              className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {currentUser.addresses.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No saved addresses found. Add an address for fast checkout.</p>
              <button
                onClick={handleOpenAddAddress}
                className="px-4 py-2 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg text-xs font-bold"
              >
                + Add Delivery Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUser.addresses.map((addr) => (
                <div 
                  key={addr.id} 
                  className={`p-4 rounded-xl border text-xs space-y-2.5 transition relative flex flex-col justify-between ${
                    addr.isDefault 
                      ? 'bg-purple-50/40 border-purple-300 shadow-sm' 
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {addr.type === 'Home' ? (
                          <Home className="w-3.5 h-3.5 text-purple-700" />
                        ) : (
                          <Building className="w-3.5 h-3.5 text-purple-700" />
                        )}
                        <span className="font-bold text-slate-900">{addr.fullName}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold uppercase">
                          {addr.type}
                        </span>
                      </div>

                      {addr.isDefault && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Default</span>
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 leading-relaxed pt-1">{addr.addressLine}</p>
                    <p className="text-slate-700 font-medium">
                      {addr.city}, {addr.state} - <span className="font-mono font-bold text-slate-900">{addr.pincode}</span>
                    </p>
                    <p className="text-slate-500 text-[11px]">Phone: <strong className="text-slate-800">{addr.phone}</strong></p>
                  </div>

                  {/* Address Actions */}
                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs mt-2">
                    {!addr.isDefault ? (
                      <button
                        onClick={() => addr.id && setDefaultAddress(addr.id)}
                        className="text-[11px] font-bold text-purple-700 hover:underline flex items-center gap-1"
                      >
                        <Star className="w-3 h-3" />
                        <span>Make Default</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">Primary Delivery</span>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => handleOpenEditAddress(addr)}
                        className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-white rounded transition"
                        title="Edit Address"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => addr.id && deleteAddress(addr.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded transition"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Account Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <button
          onClick={() => setPage('orders')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-300 text-left space-y-1 group transition shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 group-hover:text-purple-700">My Orders & Invoices</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-[11px] text-slate-500">{orders.length} order history records & tax invoices</p>
        </button>

        <button
          onClick={() => setPage('wishlist')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-300 text-left space-y-1 group transition shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 group-hover:text-purple-700">My Wishlist</span>
            <Heart className="w-4 h-4 text-pink-600" />
          </div>
          <p className="text-[11px] text-slate-500">{wishlist.length} saved products</p>
        </button>

        <button
          onClick={() => setPage('order-tracking')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-300 text-left space-y-1 group transition shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 group-hover:text-purple-700">Track Live Shipment</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-[11px] text-slate-500">Blue Dart & Delhivery AWB tracking</p>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: EDIT PROFILE */}
      {/* ========================================================================= */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Update Profile Details</h3>
              <button onClick={() => setIsEditProfileOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-400">Email Address (Managed via Auth)</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg shadow-sm transition"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT ADDRESS */}
      {/* ========================================================================= */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={addrFullName}
                    onChange={(e) => setAddrFullName(e.target.value)}
                    placeholder="Recipient's name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Flat, House no., Building, Company, Apartment *</label>
                <input
                  type="text"
                  required
                  value={addrLine}
                  onChange={(e) => setAddrLine(e.target.value)}
                  placeholder="e.g. Flat 402, Shanti Heights, Near Lotus Temple, Nehru Place"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">City / Town *</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    placeholder="e.g. New Delhi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">State *</label>
                  <select
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-600 font-medium"
                  >
                    {INDIAN_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addrPincode}
                    onChange={(e) => setAddrPincode(e.target.value)}
                    placeholder="6-digit PIN"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              {/* Address Type Selection */}
              <div className="space-y-1.5 pt-1">
                <label className="font-semibold text-slate-700 block">Address Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      name="addrType"
                      checked={addrType === 'Home'}
                      onChange={() => setAddrType('Home')}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span>Home (All-day delivery)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      name="addrType"
                      checked={addrType === 'Work'}
                      onChange={() => setAddrType('Work')}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span>Work (10 AM – 6 PM)</span>
                  </label>
                </div>
              </div>

              {/* Set as default checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-purple-900 cursor-pointer bg-purple-50 p-2.5 rounded-lg border border-purple-200">
                  <input
                    type="checkbox"
                    checked={addrIsDefault}
                    onChange={(e) => setAddrIsDefault(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                  />
                  <span>Make this my default shipping address for all future purchases</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg shadow-sm transition"
                >
                  {editingAddressId ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
