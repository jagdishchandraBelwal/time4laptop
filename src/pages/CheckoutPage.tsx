import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Building, 
  CheckCircle2, 
  ArrowLeft,
  Lock,
  ChevronRight,
  MapPin,
  Home,
  Check,
  Plus,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { EmiTenure, PaymentMethod, UserAddress } from '../types';

const INDIAN_STATES = [
  'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 
  'Uttar Pradesh', 'West Bengal', 'Telangana', 'Rajasthan', 'Kerala', 
  'Haryana', 'Punjab', 'Madhya Pradesh', 'Bihar', 'Andhra Pradesh', 'Odisha', 'Assam'
];

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartDeliveryFee, 
    cartGrandTotal, 
    currentUser, 
    placeOrder, 
    addAddress,
    setPage,
    navigateToCategory
  } = useStore();

  const savedAddresses = currentUser?.addresses || [];
  const defaultAddress = savedAddresses.find(a => a.isDefault) || savedAddresses[0];

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    defaultAddress?.id || 'new'
  );

  const [fullName, setFullName] = useState(defaultAddress?.fullName || currentUser?.name || 'Rajesh Kumar Sharma');
  const [phone, setPhone] = useState(defaultAddress?.phone || currentUser?.phone || '9876543210');
  const [email, setEmail] = useState(currentUser?.email || 'rajesh.sharma@example.com');
  const [addressLine, setAddressLine] = useState(defaultAddress?.addressLine || 'Flat 402, Shanti Heights, Near Lotus Temple, Nehru Place');
  const [city, setCity] = useState(defaultAddress?.city || 'New Delhi');
  const [state, setState] = useState(defaultAddress?.state || 'Delhi');
  const [pincode, setPincode] = useState(defaultAddress?.pincode || '110019');
  const [addressType, setAddressType] = useState<'Home' | 'Work'>(defaultAddress?.type || 'Home');
  const [saveToAccount, setSaveToAccount] = useState(true);
  const [makeDefault, setMakeDefault] = useState(false);
  const [isEditingAddressFields, setIsEditingAddressFields] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [emiMonths, setEmiMonths] = useState<EmiTenure>(6);
  const [upiId, setUpiId] = useState('rajesh@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const requestedMethod = window.sessionStorage.getItem('time4laptop-checkout-method');
    if (requestedMethod === 'EMI') setPaymentMethod('EMI');
    window.sessionStorage.removeItem('time4laptop-checkout-method');
  }, []);

  // Sync when default address or current user profile updates
  useEffect(() => {
    if (currentUser?.email && !email) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSelectSavedAddress = (addr: UserAddress) => {
    setSelectedAddressId(addr.id || 'new');
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setAddressLine(addr.addressLine);
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setAddressType(addr.type);
    setIsEditingAddressFields(false);
  };

  const handleSelectNewAddress = () => {
    setSelectedAddressId('new');
    setFullName(currentUser?.name || '');
    setPhone(currentUser?.phone || '');
    setAddressLine('');
    setCity('');
    setState('Delhi');
    setPincode('');
    setAddressType('Home');
    setSaveToAccount(true);
    setMakeDefault(savedAddresses.length === 0);
    setIsEditingAddressFields(true);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Please add products to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigateToCategory('laptops')}
          className="px-6 py-2.5 bg-purple-700 text-white rounded-lg text-xs font-bold hover:bg-purple-800 transition"
        >
          Browse IT Catalog
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const shippingAddress: UserAddress = {
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      type: addressType
    };

    // Auto-save new address to user profile if opted
    if (selectedAddressId === 'new' && saveToAccount && currentUser) {
      try {
        await addAddress({
          fullName,
          phone,
          addressLine,
          city,
          state,
          pincode,
          type: addressType,
          isDefault: makeDefault
        });
      } catch (err) {
        console.warn('Auto-save address error:', err);
      }
    }

    // Simulate fast checkout settlement and redirect to live tracking
    setTimeout(() => {
      placeOrder(shippingAddress, paymentMethod, paymentMethod === 'EMI' ? emiMonths : undefined);
      setIsProcessing(false);
      setPage('order-tracking');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Checkout Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setPage('cart')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Express Checkout</h1>
            <p className="text-xs text-slate-500">Fast, 256-bit SSL encrypted secure checkout</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <Lock className="w-3.5 h-3.5" />
          <span className="font-semibold">Bank-Grade Encryption</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Columns: Shipping & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-purple-700" />
                <span>1. Customer & Delivery Address</span>
              </h2>

              {currentUser && (
                <button
                  type="button"
                  onClick={() => setPage('account')}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 hover:underline"
                >
                  <span>Manage saved addresses in Account</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Saved Addresses Picker (if available) */}
            {savedAddresses.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Choose Delivery Address:</label>
                  <span className="text-[11px] text-slate-400 font-medium">1-Click Fast Fill</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`p-3.5 rounded-xl border text-xs cursor-pointer transition relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
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
                              <span className="text-[9px] bg-slate-200 text-slate-700 px-1 py-0.2 rounded font-semibold uppercase">
                                {addr.type}
                              </span>
                            </div>

                            {addr.isDefault && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                                Default
                              </span>
                            )}
                          </div>

                          <p className="text-slate-600 line-clamp-2 leading-relaxed">{addr.addressLine}</p>
                          <p className="text-slate-700 font-medium">
                            {addr.city}, {addr.state} - <span className="font-mono font-bold text-slate-900">{addr.pincode}</span>
                          </p>
                          <p className="text-[11px] text-slate-500">Phone: <strong className="text-slate-800">{addr.phone}</strong></p>
                        </div>

                        <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between">
                          <span className={`text-[10px] font-bold flex items-center gap-1 ${isSelected ? 'text-purple-700' : 'text-slate-400'}`}>
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
                                <span>Deliver to this Address</span>
                              </>
                            ) : (
                              <span>Click to Select</span>
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Option: Deliver to a New Address */}
                  <div
                    onClick={handleSelectNewAddress}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col items-center justify-center text-center gap-2 min-h-[130px] ${
                      selectedAddressId === 'new'
                        ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20'
                        : 'border-dashed border-slate-300 hover:border-purple-400 bg-slate-50/50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">Deliver to a New Address</span>
                      <span className="text-[10px] text-slate-500">Enter custom doorstep shipping address</span>
                    </div>
                  </div>
                </div>

                {/* Selected Address Quick Bar when collapsed */}
                {selectedAddressId !== 'new' && !isEditingAddressFields && (
                  <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-700 truncate pr-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        Selected: <strong className="text-slate-900">{fullName}</strong> · {city}, {state} ({pincode})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingAddressFields(true)}
                      className="text-purple-700 font-bold hover:underline shrink-0 flex items-center gap-1 text-[11px]"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Review / Edit Details</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Address Input Fields: Shown if new address selected or user wants to edit/review */}
            {(selectedAddressId === 'new' || isEditingAddressFields || savedAddresses.length === 0) && (
              <div className="space-y-4 pt-2">
                {savedAddresses.length > 0 && selectedAddressId !== 'new' && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Customize Address for this Order:</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingAddressFields(false)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 underline"
                    >
                      Collapse Details
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Mobile Number (10 Digits) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-semibold text-slate-700">Email Address (For Invoicing & Tracking Alerts) *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-semibold text-slate-700">Street Address / House No. / Landmark *</label>
                    <input
                      type="text"
                      required
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="House / Flat No., Apartment / Society, Landmark, Street"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. New Delhi"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">State *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-600 text-xs"
                    >
                      {INDIAN_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Postal PIN Code (6 Digits) *</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 110019"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Address Type</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAddressType('Home')}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                          addressType === 'Home'
                            ? 'bg-purple-50 border-purple-600 text-purple-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Home className="w-3.5 h-3.5" />
                        <span>Home</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddressType('Work')}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                          addressType === 'Work'
                            ? 'bg-purple-50 border-purple-600 text-purple-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Building className="w-3.5 h-3.5" />
                        <span>Work / Office</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save Address Options for Account holders */}
                {currentUser && selectedAddressId === 'new' && (
                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={saveToAccount}
                        onChange={(e) => setSaveToAccount(e.target.checked)}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                      />
                      <span className="font-semibold text-slate-700">
                        Save this address to my account for future orders
                      </span>
                    </label>

                    {saveToAccount && (
                      <label className="flex items-center gap-2 cursor-pointer select-none pl-6 text-slate-600">
                        <input
                          type="checkbox"
                          checked={makeDefault}
                          onChange={(e) => setMakeDefault(e.target.checked)}
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                        />
                        <span>Make this my primary default delivery address</span>
                      </label>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Method Selector Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-700" />
              <span>2. Select Payment Method</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-900 font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <QrCode className="w-5 h-5 text-purple-600" />
                <span>Instant UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'Card'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-900 font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-purple-600" />
                <span>Credit / Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('EMI')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'EMI'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-900 font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-purple-600" />
                <span>Card EMI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NetBanking')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'NetBanking'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-900 font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Building className="w-5 h-5 text-purple-600" />
                <span>Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-900 font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Banknote className="w-5 h-5 text-purple-600" />
                <span>Cash on Delivery</span>
              </button>
            </div>

            {/* Dynamic Payment Details Fields */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              {paymentMethod === 'UPI' && (
                <div className="space-y-2">
                  <label className="font-semibold text-slate-700">Enter UPI ID / VPA</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="mobile@upi or user@okhdfcbank"
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                    <span className="px-3 py-2 bg-emerald-100 text-emerald-800 font-bold rounded-lg flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, Cred, BHIM accepted with zero convenience fees.</p>
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'EMI' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="emi-tenure" className="font-semibold text-slate-700">Choose EMI tenure</label>
                    <select
                      id="emi-tenure"
                      value={emiMonths}
                      onChange={(e) => setEmiMonths(Number(e.target.value) as EmiTenure)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    >
                      {[3, 6, 9, 12].map(months => (
                        <option key={months} value={months}>{months} months</option>
                      ))}
                    </select>
                  </div>
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
                    <p className="font-bold text-purple-900">
                      Approx. ₹{Math.ceil(cartGrandTotal / emiMonths).toLocaleString('en-IN')} × {emiMonths} months
                    </p>
                    <p className="mt-1 text-[11px] text-slate-600">
                      Estimate before bank interest or fees. Final EMI and eligibility depend on your bank.
                    </p>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    This records an EMI order request as Pending. No payment is charged until a bank/payment gateway confirms it.
                  </p>
                </div>
              )}

              {paymentMethod === 'NetBanking' && (
                <div className="space-y-2">
                  <label className="font-semibold text-slate-700">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="space-y-1 text-slate-600">
                  <p className="font-semibold text-slate-800">Cash on Delivery (COD) Selected</p>
                  <p className="text-[11px]">Pay via cash or UPI to the Blue Dart delivery agent upon receiving the package.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Preview & Submit (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 uppercase tracking-wider">
            Review Order ({cart.length} Items)
          </h2>

          {/* Items Preview */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
            {cart.map((item) => (
              <div key={item.product.id} className="py-2.5 flex items-center gap-3">
                <img src={item.product.image} alt="" className="w-12 h-12 object-contain rounded bg-slate-50 p-1 border border-slate-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{item.product.name}</p>
                  <p className="text-[11px] text-slate-500">Qty: {item.quantity} · ₹{item.product.price.toLocaleString('en-IN')}</p>
                </div>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900 tabular-nums">₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount</span>
                <span className="tabular-nums">-₹{cartDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className="font-bold text-slate-900">
                {cartDeliveryFee === 0 ? <span className="text-emerald-600 uppercase font-bold">FREE</span> : `₹${cartDeliveryFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Amount Payable</span>
              <span className="text-2xl font-black text-purple-700 tabular-nums">
                ₹{cartGrandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Securing Order...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {paymentMethod === 'EMI' ? 'Place EMI Request' : 'Place Order'} (₹{cartGrandTotal.toLocaleString('en-IN')})
                </span>
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-400 text-center">
            By placing this order you agree to time4laptop.com's Terms of Sale and Warranty Policies.
          </p>
        </div>
      </form>
    </div>
  );
};
