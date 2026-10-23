import React, { useState } from 'react';
import { Package, Truck, ArrowRight, Clock, FileText, ChevronRight, ShoppingCart, RotateCcw, ShieldCheck, Printer, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { InvoiceModal } from '../components/InvoiceModal';
import { Order } from '../types';

export const OrdersPage: React.FC = () => {
  const { orders, navigateToTracking, addToCart, setPage, navigateToCategory, showToast } = useStore();
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [rmaOrder, setRmaOrder] = useState<Order | null>(null);
  const [rmaReason, setRmaReason] = useState('Hardware issue within 7-day guarantee');
  const [rmaSubmitted, setRmaSubmitted] = useState<string | null>(null);

  const handleRmaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rmaOrder) return;
    setRmaSubmitted(rmaOrder.id);
    showToast(`RMA return request submitted for Order #${rmaOrder.id}. Courier pickup will be scheduled.`);
    setRmaOrder(null);
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Package className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">No Orders Placed Yet</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You haven't made any purchases yet. Start shopping to find genuine certified refurbished laptops and devices.
        </p>
        <button
          onClick={() => navigateToCategory('laptops')}
          className="px-6 py-3 bg-purple-700 text-white rounded-xl text-xs font-bold"
        >
          Browse Certified Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Orders & Invoices</h1>
          <p className="text-xs text-slate-500">Track current shipments, download GST tax invoices, and request 7-day RMA returns</p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-800 rounded-lg text-xs font-bold border border-purple-200">
          <ShieldCheck className="w-4 h-4 text-purple-700" />
          <span>7-Day Replacement Guarantee Active</span>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:border-purple-200 transition-colors"
          >
            {/* Order header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-slate-900">Order #{order.id}</span>
                <span className="text-slate-400">· Placed on {order.date}</span>
                <span className="text-slate-500 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                  AWB: {order.trackingNumber}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  order.status === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.status === 'Cancelled'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {order.status}
                </span>

                <button
                  onClick={() => setSelectedInvoiceOrder(order)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-slate-200"
                  title="View or print official GST tax invoice"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-700" />
                  <span>Invoice</span>
                </button>

                <button
                  onClick={() => navigateToTracking(order.id)}
                  className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track</span>
                </button>
              </div>
            </div>

            {/* Items list */}
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.product.image}
                      alt=""
                      className="w-12 h-12 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate max-w-md">{item.product.name}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 text-[10px]">
                          {item.product.conditionGrade || 'Grade A - Like New'}
                        </span>
                        <span>Qty: {item.quantity} · ₹{item.product.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900 tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total and actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-slate-600">
                <span>Shipping to: <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.city}) via {order.courier}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-slate-900">
                  Total Paid: <strong className="text-purple-700 text-sm">₹{order.total.toLocaleString('en-IN')}</strong>
                </span>

                {/* 7-Day RMA Return Option */}
                {rmaSubmitted === order.id ? (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>RMA Request In Review</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setRmaOrder(order)}
                    className="px-2.5 py-1 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-semibold border border-slate-200 transition"
                    title="Request 7-day replacement under warranty"
                  >
                    <RotateCcw className="w-3 h-3 inline mr-1" />
                    <span>Return / RMA</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    order.items.forEach(it => addToCart(it.product, it.quantity));
                    setPage('cart');
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Reorder</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tax Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={!!selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      {/* RMA / Return Dialog */}
      {rmaOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <RotateCcw className="w-5 h-5" />
              <span>Initiate 7-Day Replacement / RMA</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Order #{rmaOrder.id} is covered by the Time4Laptop 7-Day Hassle-Free Replacement Policy. If there is a functional issue, select the reason below for automated doorstep pickup.
            </p>

            <form onSubmit={handleRmaSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Reason for Return / Exchange</label>
                <select
                  value={rmaReason}
                  onChange={(e) => setRmaReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                >
                  <option value="Hardware issue within 7-day guarantee">Hardware malfunction / diagnostics error</option>
                  <option value="Battery draining faster than expected">Battery issue (&lt; 80% capacity)</option>
                  <option value="Display line or dead pixel">Display or cosmetic discrepancy</option>
                  <option value="Wrong specs received">Wrong specification / model delivered</option>
                  <option value="Other functional defect">Other functional defect</option>
                </select>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-[11px] text-purple-900 space-y-1">
                <span className="font-bold">Next Steps:</span>
                <p>Our courier partner will contact you for doorstep pickup of the device with its charger within 24–48 hours.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRmaOrder(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 text-white font-bold rounded-lg hover:bg-rose-800 transition shadow-sm"
                >
                  Confirm RMA Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
