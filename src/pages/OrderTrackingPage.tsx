import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Clock, 
  FileText, 
  Printer, 
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const ORDER_STEPS = [
  { id: 'placed', label: 'Order Placed', desc: 'Received & Logged' },
  { id: 'confirmed', label: 'Order Confirmed', desc: 'Inventory Verified' },
  { id: 'packed', label: 'Packed', desc: 'Tamper-Evident Box' },
  { id: 'shipped', label: 'Shipped', desc: 'In Air Transit' },
  { id: 'out', label: 'Out for Delivery', desc: 'With Courier Agent' },
  { id: 'delivered', label: 'Delivered', desc: 'Signed & Received' }
];

export const OrderTrackingPage: React.FC = () => {
  const { orders, trackingOrderId, navigateToTracking, showToast, setPage } = useStore();
  const [searchInput, setSearchInput] = useState(trackingOrderId || (orders[0]?.id || ''));
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Find targeted order
  const currentOrder = orders.find(
    o => o.id.toLowerCase() === searchInput.trim().toLowerCase() ||
         o.trackingNumber.toLowerCase() === searchInput.trim().toLowerCase()
  ) || orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigateToTracking(searchInput.trim());
    }
  };

  // Determine current active step index
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Order Placed': return 0;
      case 'Order Confirmed': return 1;
      case 'Packed': return 2;
      case 'Shipped': return 3;
      case 'Out for Delivery': return 4;
      case 'Delivered': return 5;
      default: return 1;
    }
  };

  const activeIndex = currentOrder ? getStepIndex(currentOrder.status) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Tracking Header & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Live Order Tracking</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time shipment milestones, courier AWB and digital invoices
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Order ID or Tracking Number"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold uppercase focus:bg-white focus:outline-none focus:border-purple-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            Track Status
          </button>
        </form>

        {/* Quick order shortcuts */}
        {orders.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Recent Orders:</span>
            {orders.slice(0, 3).map(o => (
              <button
                key={o.id}
                onClick={() => {
                  setSearchInput(o.id);
                  navigateToTracking(o.id);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-colors ${
                  currentOrder?.id === o.id
                    ? 'bg-purple-100 border-purple-300 text-purple-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {o.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {currentOrder ? (
        <div className="space-y-6">
          {/* Tracking Progress Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            {/* Order meta bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Order Reference: {currentOrder.id}
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  Status: <span className="text-purple-700">{currentOrder.status}</span>
                </h2>
                <p className="text-xs text-slate-400">Placed on {currentOrder.date}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-purple-700" />
                  <span>View Tax Invoice</span>
                </button>
              </div>
            </div>

            {/* Stepper Timeline Visualizer */}
            <div className="relative py-4">
              {/* Desktop Stepper Bar */}
              <div className="grid grid-cols-6 gap-2 relative">
                {/* Horizontal connector line */}
                <div className="absolute top-5 left-8 right-8 h-1 bg-slate-100 -z-0">
                  <div
                    className="h-full bg-purple-600 transition-all duration-500"
                    style={{ width: `${(activeIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
                  />
                </div>

                {ORDER_STEPS.map((step, idx) => {
                  const isDone = idx <= activeIndex;
                  const isCurrent = idx === activeIndex;

                  return (
                    <div key={step.id} className="flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${
                          isDone
                            ? 'bg-purple-700 text-white shadow-purple-600/30'
                            : 'bg-white border-2 border-slate-200 text-slate-400'
                        } ${isCurrent ? 'ring-4 ring-purple-100' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <span className={`text-xs font-bold mt-2.5 ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier & Shipping Meta details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 space-y-1">
                <span className="text-slate-400 font-medium">Logistics Partner</span>
                <p className="font-bold text-slate-900">{currentOrder.courier}</p>
                <p className="text-[11px] text-purple-700 font-mono">AWB: {currentOrder.trackingNumber}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 space-y-1">
                <span className="text-slate-400 font-medium">Estimated Arrival</span>
                <p className="font-bold text-slate-900">{currentOrder.estimatedDelivery}</p>
                <p className="text-[11px] text-emerald-600 font-medium">✓ On Schedule via Priority Flight</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 space-y-1">
                <span className="text-slate-400 font-medium">Destination</span>
                <p className="font-bold text-slate-900">{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state}</p>
                <p className="text-[11px] text-slate-500">PIN: {currentOrder.shippingAddress.pincode}</p>
              </div>
            </div>
          </div>

          {/* Ordered Hardware Items */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Dispatched Hardware in this Shipment
            </h3>

            <div className="divide-y divide-slate-100">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.product.image} alt="" className="w-12 h-12 object-contain rounded bg-slate-50 p-1 border border-slate-100 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900">{item.product.name}</p>
                      <p className="text-slate-500 font-mono">{item.product.brand} · Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between text-xs">
              <span className="font-bold text-slate-700">Order Total:</span>
              <span className="font-black text-purple-700 text-sm tabular-nums">
                ₹{currentOrder.total.toLocaleString('en-IN')} ({currentOrder.paymentMethod === 'EMI' ? `EMI · ${currentOrder.emiMonths || 6} months` : currentOrder.paymentMethod})
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No order records found matching that ID.
        </div>
      )}

      {/* Printable Invoice Modal */}
      {showInvoiceModal && currentOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Invoice Top Lockup */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-black text-purple-700">time4laptop.com</h3>
                <p className="text-[11px] text-slate-500">Authorized IT Electronics Retailer</p>
                <p className="text-[11px] text-slate-500">GSTIN: 07AAACM4120N1Z8 | Nehru Place, New Delhi</p>
              </div>
              <div className="text-right text-xs">
                <span className="font-bold text-slate-900 block">TAX INVOICE</span>
                <span className="font-mono text-slate-500">INV-{currentOrder.id}</span>
                <span className="text-slate-400 block mt-1">Date: {currentOrder.date}</span>
              </div>
            </div>

            {/* Bill to */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Billed To:</span>
                <p className="font-bold text-slate-900">{currentOrder.shippingAddress.fullName}</p>
                <p className="text-slate-600">{currentOrder.shippingAddress.addressLine}</p>
                <p className="text-slate-600">{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}</p>
                <p className="text-slate-600">Phone: {currentOrder.shippingAddress.phone}</p>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Payment Details:</span>
                <p className="font-bold text-slate-900">Status: {currentOrder.paymentStatus.toUpperCase()}</p>
                <p className="text-slate-600">
                  Mode: {currentOrder.paymentMethod === 'EMI' ? `Card EMI · ${currentOrder.emiMonths || 6} months` : currentOrder.paymentMethod}
                </p>
                <p className="text-slate-600 font-mono text-[11px]">Tracking: {currentOrder.trackingNumber}</p>
              </div>
            </div>

            {/* Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td className="p-3 font-semibold text-slate-900">{item.product.name}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right tabular-nums">₹{item.product.price.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-bold tabular-nums">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-end text-xs space-y-1">
              <div className="w-60 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="tabular-nums font-bold">₹{currentOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {currentOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span className="tabular-nums">-₹{currentOrder.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Delivery:</span>
                  <span>{currentOrder.deliveryFee === 0 ? 'FREE' : `₹${currentOrder.deliveryFee}`}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-purple-700">
                  <span>Grand Total:</span>
                  <span className="tabular-nums">₹{currentOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
