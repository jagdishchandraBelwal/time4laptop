import React from 'react';
import { X, Printer, Download, ShieldCheck, Cpu } from 'lucide-react';
import { Order } from '../types';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const invoiceNumber = order.invoiceNumber || `T4L-INV-${order.id.replace(/[^A-Za-z0-9]/g, '')}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Controls (Not printed) */}
        <div className="print:hidden bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Printer className="w-4 h-4 text-purple-700" />
            <span>Tax Invoice & Certified Refurbished Warranty Seal</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-900 print:p-0" id="printable-invoice">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center font-black">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900">
                  time4<span className="text-purple-600">laptop.com</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Premier Refurbished Laptops & Electronics Network
              </p>
              <p className="text-[11px] text-slate-500">
                GSTIN: 07AAACT4L101Z5 · CIN: U72900DL2024PTC10992
              </p>
              <p className="text-[11px] text-slate-500">
                Central IT Logistics Hub, Nehru Place, New Delhi - 110019
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
                Original Tax Invoice
              </span>
              <p className="text-xs font-bold text-slate-900">Invoice No: {invoiceNumber}</p>
              <p className="text-xs text-slate-600">Order ID: #{order.id}</p>
              <p className="text-xs text-slate-600">Date: {order.date}</p>
              <p className="text-xs text-slate-600">Payment: {order.paymentMethod} ({order.paymentStatus})</p>
            </div>
          </div>

          {/* Billing & Shipping Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-6">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Customer / Billed To</span>
              <p className="font-bold text-slate-900 text-sm">{order.shippingAddress.fullName}</p>
              <p className="text-slate-600">{order.shippingAddress.addressLine}</p>
              <p className="text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="text-slate-600 font-medium mt-1">Phone: {order.shippingAddress.phone}</p>
            </div>

            <div className="sm:text-right">
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Shipping Logistics</span>
              <p className="font-bold text-slate-900">{order.courier || 'Blue Dart Express Air'}</p>
              <p className="text-slate-600">AWB Tracking: <span className="font-mono font-bold text-purple-700">{order.trackingNumber}</span></p>
              <p className="text-slate-600">Order Status: <span className="font-bold text-emerald-700">{order.status}</span></p>
              <p className="text-slate-600">Est. Delivery: {order.estimatedDelivery}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Item & Refurbished Grade</th>
                  <th className="py-2.5">Condition / Warranty</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Price (₹)</th>
                  <th className="py-2.5 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-3 font-semibold text-slate-900">
                      {item.product.name}
                      <span className="block text-[10px] text-slate-500 font-normal">
                        SKU: {item.product.sku || `T4L-${item.product.category.toUpperCase()}-${item.product.id.slice(-4)}`}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {item.product.conditionGrade || 'Grade A - Like New'}
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-0.5">
                        {item.product.specs?.warranty || '1 Year Comprehensive Warranty'}
                      </span>
                    </td>
                    <td className="py-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 text-right">₹{item.product.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right font-bold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-slate-200 pt-4 flex flex-col items-end text-xs space-y-1.5">
            <div className="flex justify-between w-64 text-slate-600">
              <span>Subtotal:</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between w-64 text-emerald-700 font-medium">
                <span>Promotional Discount:</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between w-64 text-slate-600">
              <span>Insured Shipping Fee:</span>
              <span className="text-emerald-700 font-bold">{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between w-64 pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
              <span>Grand Total:</span>
              <span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Certified Refurbished Warranty Declaration Seal */}
          <div className="border border-purple-200 bg-purple-50/60 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-purple-700 shrink-0" />
              <div>
                <span className="font-bold text-purple-950 block">40-Point Quality Assurance & Warranty Certified</span>
                <span className="text-[11px] text-purple-800">
                  Inspected for motherboard thermals, screen purity, and 85%+ battery health. Serial numbers registered for warranty support.
                </span>
              </div>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <div className="w-24 h-10 border-b border-purple-400 mx-auto sm:ml-auto flex items-end justify-center">
                <span className="text-[10px] font-bold text-purple-800 italic">T4L Quality Lead</span>
              </div>
              <span className="text-[9px] text-purple-600 font-bold uppercase tracking-wider">Authorized QC Seal</span>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="text-[10px] text-slate-400 text-center pt-2">
            This is a computer-generated invoice. For support or warranty claims, contact support@time4laptop.com or +91 98765 43210.
          </div>
        </div>
      </div>
    </div>
  );
};
