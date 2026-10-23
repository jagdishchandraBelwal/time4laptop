import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been received! Our IT desk will call you back within 2 hours.');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Contact Us</h1>
        <p className="text-xs text-slate-500">
          Have a custom PC query, enterprise quote requirement, or warranty inquiry? Our sales and support specialists are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Store Locations & Helplines (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* New Delhi Flagship Store */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <MapPin className="w-5 h-5 text-purple-700" />
              <span>New Delhi Flagship Store (Nehru Place)</span>
            </div>
            <p className="text-xs text-slate-600">
              Shop No. 104-106, 1st Floor, Eros Corporate Tower Arcade, Nehru Place, New Delhi - 110019
            </p>
            <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <p><strong>Phone:</strong> +91 98765 43210 / (011) 4123-4567</p>
              <p><strong>Hours:</strong> Mon - Sat: 10:30 AM - 8:30 PM (Sunday Closed)</p>
            </div>
          </div>

          {/* Mumbai Experience Store */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <MapPin className="w-5 h-5 text-purple-700" />
              <span>Mumbai Store (Lamington Road)</span>
            </div>
            <p className="text-xs text-slate-600">
              Ground Floor, IT Trade Centre, Dr. D.B. Marg, Lamington Road, Grant Road East, Mumbai - 400007
            </p>
            <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <p><strong>Phone:</strong> +91 98765 43211 / (022) 2387-9012</p>
              <p><strong>Hours:</strong> Mon - Sat: 11:00 AM - 8:00 PM</p>
            </div>
          </div>

          {/* Support Email */}
          <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-purple-700" />
              <span>Customer Care Email</span>
            </p>
            <p className="text-slate-600">support@time4laptop.com | b2b@time4laptop.com</p>
          </div>
        </div>

        {/* Right: Message Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Send an Inquiry or Quote Request</h2>
            <p className="text-xs text-slate-500">Expect a response from our technical desk within 2 business hours.</p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-900">Message Dispatched Successfully!</h3>
              <p className="text-xs text-emerald-700">
                Our IT hardware executive will get in touch with you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold text-purple-700 underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aman Verma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aman@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Message / Hardware Requirement *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what laptop, gaming rig specs or bulk IT requirements you need..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
