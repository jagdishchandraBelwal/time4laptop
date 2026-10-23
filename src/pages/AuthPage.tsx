import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Cpu, Lock, Mail, Phone, User as UserIcon } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { isSupabaseConfigured } from '../lib/supabase';

export const AuthPage: React.FC = () => {
  const { login, register, setPage, authLoading } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const switchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setPending(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        setPage('home');
      } else {
        const needsEmailConfirmation = await register(name, email, phone, password);
        if (needsEmailConfirmation) {
          setSuccessMessage('Account created. Check your email and confirm the address before signing in.');
          setMode('login');
          setPassword('');
        } else {
          setPage('home');
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Sign in nahi ho paya. Details check karke phir try karein.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-purple-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-purple-600/20">
          <Cpu className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {mode === 'login' ? 'Sign In to Your Account' : 'Create time4laptop.com Account'}
        </h1>
        <p className="text-xs text-slate-500">
          Secure sign-in for your time4laptop.com customer account
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-950">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" />
          <div className="space-y-1">
            <p className="font-bold">Account login setup is needed</p>
            <p className="leading-relaxed">
              Add your Supabase project URL and publishable key to <code className="font-semibold">.env.local</code>, then restart the app.
            </p>
          </div>
        </div>
      )}

      {successMessage && (
        <div role="status" className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`py-2 rounded-lg transition-colors ${mode === 'login' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`py-2 rounded-lg transition-colors ${mode === 'register' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label htmlFor="auth-name" className="font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <input
                    id="auth-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-600"
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="auth-phone" className="font-semibold text-slate-700">Mobile Number</label>
                <div className="relative">
                  <input
                    id="auth-phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-600"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label htmlFor="auth-email" className="font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-600"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="auth-password" className="font-semibold text-slate-700">Password</label>
            <div className="relative">
              <input
                id="auth-password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={mode === 'register' ? 8 : undefined}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-purple-600"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isSupabaseConfigured || pending || authLoading}
            className="w-full py-3 bg-purple-700 hover:bg-purple-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{pending || authLoading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create My Account'}</span>
            {!pending && !authLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
