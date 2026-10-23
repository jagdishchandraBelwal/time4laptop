import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Wrench, RefreshCw, Cpu, PhoneCall } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WarrantyPolicyPage: React.FC = () => {
  const { setPage } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Certified Refurbished Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Time4Laptop Warranty Policy
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Every refurbished laptop, mobile, and gaming console sold on Time4Laptop undergoes a rigorous 40-point quality check and is covered by our comprehensive hardware warranty.
        </p>
      </div>

      {/* Warranty Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">Up to 12 Months Warranty</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Grade A and Grade B electronics come with 6 to 12 months comprehensive hardware warranty covering motherboard, display, and components.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">7-Day Hassle-Free Replacement</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            If you face any functional defect within 7 days of delivery, we provide an immediate doorstep replacement or 100% refund.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">Pan-India Service & Support</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Free doorstep pickup and return across 28,000+ Indian pincodes via Blue Dart & Delhivery express insured logistics.
          </p>
        </div>
      </div>

      {/* Refurbished Condition Grading Explanation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Refurbished Grading Standards</h2>
        <div className="space-y-4 text-xs text-slate-600">
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
            <span className="font-bold text-emerald-800 text-sm">Grade A — Like New</span>
            <p>Pristine condition with zero or negligible cosmetic marks. 100% hardware functionality, battery health 85% to 95%+, packaged in a secure Time4Laptop branded protective box with original or certified OEM charger.</p>
          </div>

          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1">
            <span className="font-bold text-blue-800 text-sm">Grade B — Excellent</span>
            <p>Minor light micro-scratches on casing. Screen is 100% flawless with no dead pixels. Rigorously tested 40-point diagnostics passed with certified charger included.</p>
          </div>

          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
            <span className="font-bold text-amber-800 text-sm">Grade C — Good Value</span>
            <p>Visible cosmetic scratches or small scuffs on outer chassis. Screen and all internals work with 100% operational performance. Budget-friendly for developers and students.</p>
          </div>
        </div>
      </div>

      {/* What is covered vs not covered */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>What is Covered Under Warranty</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Motherboard, processor, RAM, and internal storage malfunctions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Display issues (lines, flickering, backlight failure not caused by impact).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Battery failure (inability to charge or sudden shutdown).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Charger, internal Wi-Fi/Bluetooth, and keyboard trackpad failures.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>What is NOT Covered</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span>Physical damage (cracked screens, chassis drops, broken hinges).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span>Liquid spillage or water damage.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span>Unauthorized repairs or opening the laptop chassis without prior approval.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span>Software issues, operating system corruption, or third-party viruses.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Claim Warranty CTA */}
      <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">Need to claim warranty or request support?</h3>
          <p className="text-xs text-purple-200">Our technical helpline is available Monday – Saturday, 10 AM to 7 PM IST.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setPage('contact')}
            className="px-4 py-2 bg-white text-purple-900 font-bold text-xs rounded-xl hover:bg-purple-50 transition"
          >
            Contact Support
          </button>
          <button
            onClick={() => setPage('orders')}
            className="px-4 py-2 bg-purple-700 text-white font-bold text-xs rounded-xl hover:bg-purple-600 transition"
          >
            My Orders
          </button>
        </div>
      </div>
    </div>
  );
};
