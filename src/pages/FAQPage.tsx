import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle, ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';

const FAQ_ITEMS = [
  {
    category: 'Warranty & Authenticity',
    question: 'Are all products sold on time4laptop.com 100% genuine with brand warranty?',
    answer: 'Yes, absolutely. time4laptop.com is an authorized partner for Apple, ASUS, Dell, HP, Lenovo, Sony, Samsung, NVIDIA, and Logitech. Every item is brand-sealed with an official manufacturer warranty card and a GST tax invoice valid across all official brand service centers throughout India.'
  },
  {
    category: 'Delivery & Shipping',
    question: 'How long does express delivery take across India?',
    answer: 'Metro cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune) typically receive delivery within 24 to 48 hours via Blue Dart Express Air. Non-metro destinations receive orders within 3 to 4 business days. Orders placed before 2:00 PM are dispatched on the same day.'
  },
  {
    category: 'Returns & Replacement',
    question: 'What is time4laptop.com’s 7-Day Replacement Policy?',
    answer: 'If you receive any hardware that is Dead-on-Arrival (DOA), physically damaged during transit, or missing parts, you can notify us within 7 days of delivery. After a quick verification by our technical team, a direct 1-to-1 brand new replacement is dispatched immediately at zero additional shipping cost.'
  },
  {
    category: 'Billing & GST',
    question: 'Can I get a GST Input Tax Credit (ITC) invoice for my business or startup?',
    answer: 'Yes! During checkout, simply enter your registered Business Name and 15-digit GSTIN. You will receive an official B2B tax invoice with 18% GST breakdown, allowing you to claim full input tax credit on your IT hardware purchases.'
  },
  {
    category: 'Payments',
    question: 'What payment modes are accepted? Is Cash on Delivery (COD) available?',
    answer: 'The checkout can record UPI, card, Net Banking, EMI and Cash on Delivery (COD) orders. EMI tenure and estimated monthly amount are shown at checkout; final eligibility, interest and fees depend on the issuing bank. EMI requests remain pending until payment is confirmed.'
  },
  {
    category: 'Gaming Rigs & Custom PCs',
    question: 'Do you assemble custom liquid-cooled gaming PCs and workstations?',
    answer: 'Yes! Our custom PC division in Nehru Place handcrafts high-end gaming rigs and AI workstations featuring RTX 4080/4090 GPUs, Intel Core i9/AMD Ryzen 9 processors, and custom liquid loops. Every machine undergoes 24 hours of burn-in stability testing before insured wood-crate crated dispatch.'
  }
];

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const filteredFaqs = FAQ_ITEMS.filter(f =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.answer.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-xs text-slate-500">
          Everything you need to know about warranties, shipping milestones, GST tax invoicing and return policies
        </p>

        {/* Search FAQ */}
        <div className="relative pt-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs (e.g. warranty, GST, delivery time, COD)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-600 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-5" />
        </div>
      </div>

      {/* Accordion List */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="transition-colors">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-purple-50/40 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-1">
                    {faq.category}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-purple-700 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed bg-slate-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
