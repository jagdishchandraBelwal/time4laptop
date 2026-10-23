import React, { useState } from 'react';
import { 
  Cpu, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Send, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';

export const Footer: React.FC = () => {
  const { setPage, navigateToCategory, showToast, currentUser } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setSubscribed(true);
      showToast('Subscribed to time4laptop.com VIP updates!');
      setNewsletterEmail('');
    } else {
      showToast('Please enter a valid email address', 'error');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t-4 border-purple-600">
      {/* 4 Pillars of Trust */}
      <div className="max-w-7xl mx-auto px-4 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="p-3 bg-purple-900/60 rounded-lg text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">100% Genuine Warranty</h4>
              <p className="text-xs text-slate-400">Direct authorized brand distributor products with tax invoices.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="p-3 bg-purple-900/60 rounded-lg text-purple-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Express India Delivery</h4>
              <p className="text-xs text-slate-400">Blue Dart & Delhivery air priority shipping with live tracking.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="p-3 bg-purple-900/60 rounded-lg text-purple-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">7 Days Replacement</h4>
              <p className="text-xs text-slate-400">Hassle-free replacement for any dead-on-arrival or damaged hardware.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="p-3 bg-purple-900/60 rounded-lg text-purple-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Flexible Payments</h4>
              <p className="text-xs text-slate-400">UPI, cards, NetBanking, EMI requests & COD. Bank terms apply.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-md">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                time4<span className="text-purple-400">laptop.com</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-sm">
              time4laptop.com is India's premier IT technology enterprise and computer retail hub. Delivering flagship laptops, smartphones, custom gaming battlestations, and genuine enterprise components since 2012.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Shop 104-106, Nehru Place IT Hub, New Delhi - 110019</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Sales & Tech Support: +91 98765 43210 / (011) 4123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span>support@time4laptop.com | sales@time4laptop.com</span>
              </div>
            </div>
          </div>

          {/* IT Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Popular Categories</h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 7).map((c) => (
                <li key={c.slug}>
                  <button
                    onClick={() => navigateToCategory(c.slug)}
                    className="hover:text-purple-400 transition-colors text-slate-400 hover:underline"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Customer Support</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setPage('warranty-policy')} className="hover:text-purple-400 transition-colors">
                  🛡️ Certified Warranty Policy
                </button>
              </li>
              <li>
                <button onClick={() => setPage('return-policy')} className="hover:text-purple-400 transition-colors">
                  🔄 7-Day Replacement & RMA
                </button>
              </li>
              <li>
                <button onClick={() => setPage('shipping-policy')} className="hover:text-purple-400 transition-colors">
                  🚚 Express Shipping Timelines
                </button>
              </li>
              <li>
                <button onClick={() => setPage('order-tracking')} className="hover:text-purple-400 transition-colors">
                  Track Your Shipment
                </button>
              </li>
              <li>
                <button onClick={() => setPage('orders')} className="hover:text-purple-400 transition-colors">
                  My Orders & Invoices
                </button>
              </li>
              <li>
                <button onClick={() => setPage('faq')} className="hover:text-purple-400 transition-colors">
                  FAQs & Help Center
                </button>
              </li>
              <li>
                <button onClick={() => setPage('about')} className="hover:text-purple-400 transition-colors">
                  About time4laptop.com
                </button>
              </li>
              <li>
                <button onClick={() => setPage('contact')} className="hover:text-purple-400 transition-colors">
                  Contact Store & Service Centers
                </button>
              </li>
              {currentUser?.role === 'admin' && (
                <li>
                  <button onClick={() => setPage('admin')} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                    Admin Dashboard Portal
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Deals & Price Drops</h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to get exclusive discount codes, flash sale alerts and new hardware drop notifications.
            </p>

            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email address..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Get 10% Discount Code</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
              GST Registered Store: <span className="font-mono text-slate-400">07AAACM4120N1Z8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Row */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} <strong className="text-slate-300">time4laptop.com</strong>. All Rights Reserved. All brand logos and trademarks are property of their respective owners.
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">UPI / QR</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">RuPay</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Visa / MC</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">NetBanking</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Cash on Delivery</span>
        </div>
      </div>
    </footer>
  );
};
