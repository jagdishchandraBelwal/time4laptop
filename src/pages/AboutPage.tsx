import React from 'react';
import { ShieldCheck, Award, Users, Cpu, MapPin, Truck, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { setPage, navigateToCategory } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Brand Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Serving Indian Tech Enthusiasts Since 2012
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          About time4laptop.com
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Founded in the iconic IT corridor of Nehru Place, New Delhi, time4laptop.com has grown into India's premier destination for genuine laptops, custom gaming battlestations, and professional enterprise hardware.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">100% Authorized Distributor</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We partner directly with tier-1 national distributors for Apple, ASUS, Dell, HP, Lenovo, Sony, Samsung and NVIDIA. Zero grey-market or refurbished stock.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Master Hardware Technicians</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our in-house bench technicians stress-test every liquid-cooled gaming PC and workstation before dispatch, ensuring peak thermal stability and performance.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Air Express Dispatch</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Operating specialized dispatch hubs in New Delhi, Mumbai, and Bengaluru for insured air cargo delivery to over 19,000 postal codes across India.
          </p>
        </div>
      </div>

      {/* Heritage Story Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Our Heritage & Promise</h2>
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            When time4laptop.com opened its flagship retail doors in 2012, our mission was simple: give Indian customers transparent pricing, genuine manufacturer warranties, and reliable technical counsel without the confusion of unauthorized resellers.
          </p>
          <p>
            Over the last decade, we have proudly served over 50,000 gamers, engineering students, software enterprises, and digital creators. Whether you need a high-yield ink-tank printer for your home office or a custom liquid-cooled workstation powered by an RTX 4090, time4laptop.com provides end-to-end guidance and dedicated after-sales support.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-2xl font-black text-purple-700 tabular-nums">50,000+</span>
            <span className="text-xs text-slate-500 block">Orders Delivered</span>
          </div>
          <div>
            <span className="text-2xl font-black text-purple-700 tabular-nums">100%</span>
            <span className="text-xs text-slate-500 block">Original Warranty</span>
          </div>
          <div>
            <span className="text-2xl font-black text-purple-700 tabular-nums">19,000+</span>
            <span className="text-xs text-slate-500 block">PIN Codes Covered</span>
          </div>
          <div>
            <span className="text-2xl font-black text-purple-700 tabular-nums">14+</span>
            <span className="text-xs text-slate-500 block">Years in IT Retail</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={() => navigateToCategory('laptops')}
          className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
        >
          Explore Our Store Catalog →
        </button>
      </div>
    </div>
  );
};
