import React from 'react';
import { Truck, ShieldCheck, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ShippingPolicyPage: React.FC = () => {
  const { setPage } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
          <Truck className="w-4 h-4" />
          <span>Express Logistics Network</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Shipping & Delivery Policy
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Time4Laptop partners with India's leading courier networks including Blue Dart Express Air, Delhivery, and DTDC to ensure tamper-proof, insured delivery directly to your doorstep.
        </p>
      </div>

      {/* Shipping Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">Same-Day Dispatch</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Orders confirmed before 2:00 PM IST are packaged with shock-absorbing multi-layer cushioning and dispatched the same day.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">100% Transit Insurance</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every shipment is covered by comprehensive transit insurance. If a parcel is lost or damaged in transit, we issue an immediate replacement.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">Free Shipping Nationwide</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Free express delivery on all orders over ₹999 across 28,000+ pincodes covering all Tier 1, Tier 2, and Tier 3 cities.
          </p>
        </div>
      </div>

      {/* Delivery Timelines Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Estimated Delivery Timelines</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-2.5">Region / City Tier</th>
                <th className="py-2.5">Primary Courier Partner</th>
                <th className="py-2.5">Estimated Transit Time</th>
                <th className="py-2.5">Shipping Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr>
                <td className="py-3 font-bold text-slate-900">Metro Cities (Delhi NCR, Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata)</td>
                <td className="py-3">Blue Dart Air Express</td>
                <td className="py-3 text-emerald-700 font-bold">24 – 48 Hours</td>
                <td className="py-3 text-purple-700 font-bold">FREE</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Tier 2 Cities (Pune, Ahmedabad, Jaipur, Lucknow, Chandigarh, Surat)</td>
                <td className="py-3">Delhivery Express</td>
                <td className="py-3 text-emerald-700 font-bold">2 – 3 Business Days</td>
                <td className="py-3 text-purple-700 font-bold">FREE</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Rest of India & Rural Outlying Regions</td>
                <td className="py-3">DTDC / India Post Speed Post</td>
                <td className="py-3">4 – 5 Business Days</td>
                <td className="py-3 text-purple-700 font-bold">FREE (Orders &gt; ₹999)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Info */}
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Already placed an order? Track live shipment</h4>
          <p className="text-xs text-slate-500">Enter your order ID or tracking AWB number to view live Blue Dart tracking milestones.</p>
        </div>
        <button
          onClick={() => setPage('order-tracking')}
          className="px-5 py-2.5 bg-purple-700 text-white rounded-xl text-xs font-bold hover:bg-purple-800 transition whitespace-nowrap shadow-sm"
        >
          Track My Order
        </button>
      </div>
    </div>
  );
};
