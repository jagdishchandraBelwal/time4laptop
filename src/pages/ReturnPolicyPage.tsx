import React from 'react';
import { RefreshCw, PackageCheck, Truck, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ReturnPolicyPage: React.FC = () => {
  const { setPage } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
          <RefreshCw className="w-4 h-4" />
          <span>Customer First Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          7-Day Replacement & Return Policy
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          At Time4Laptop, we want you to purchase refurbished electronics with complete peace of mind. We offer a transparent 7-day hassle-free replacement window for any hardware discrepancies.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { step: '1', title: 'Submit Request', desc: 'Click Return/RMA in your Orders page within 7 days of delivery.' },
          { step: '2', title: 'Fast Approval', desc: 'Our technical team reviews and issues an instant RMA return token.' },
          { step: '3', title: 'Free Doorstep Pickup', desc: 'Blue Dart / Delhivery courier collects the packaged device from your door.' },
          { step: '4', title: 'Replacement or Refund', desc: 'Tested replacement dispatched or 100% refund credited back within 48 hours.' },
        ].map((item) => (
          <div key={item.step} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center">
              {item.step}
            </span>
            <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Conditions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Return Eligibility Criteria</h3>
        <ul className="space-y-2 text-xs text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-purple-700 font-bold">•</span>
            <span>The item must be returned with all original accessories included (original or certified OEM charger, charging cable, packaging).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-700 font-bold">•</span>
            <span>Device must be factory reset and free of any iCloud, Google, or BIOS passwords.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-700 font-bold">•</span>
            <span>The serial number and warranty sticker must match the dispatch invoice recorded in our database.</span>
          </li>
        </ul>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => setPage('orders')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition shadow-md"
        >
          <span>View My Orders to Initiate RMA</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
