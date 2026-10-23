import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ViewModeBar } from './components/ViewModeBar';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrdersPage } from './pages/OrdersPage';
import { AccountPage } from './pages/AccountPage';
import { AuthPage } from './pages/AuthPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { WarrantyPolicyPage } from './pages/WarrantyPolicyPage';
import { ReturnPolicyPage } from './pages/ReturnPolicyPage';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';
import { CheckCircle2, AlertCircle, Info, ShieldCheck } from 'lucide-react';

import { ComingSoonPage } from './pages/ComingSoonPage';
// Only enable Coming Soon if VITE_COMING_SOON is explicitly 'true'
const IS_COMING_SOON = import.meta.env.VITE_COMING_SOON === 'true';

const AppContent: React.FC = () => {
  const { page, toasts, currentUser, setPage, loginAsDemoAdmin } = useStore();

  // If URL has ?admin=true, automatically unlock admin mode
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || params.get('page') === 'admin') {
        loginAsDemoAdmin();
        setPage('admin');
      }
    }
  }, []);

  const signInRequired = (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Please Sign In</h2>
      <p className="text-xs text-slate-500">Sign in to view your account information.</p>
      <button onClick={() => setPage('auth')} className="px-6 py-2.5 bg-purple-700 text-white rounded-lg text-xs font-bold">
        Go to Sign In
      </button>
    </div>
  );

  const renderActivePage = () => {
    switch (page) {
      case 'home': return <HomePage />;
      case 'category': return <CatalogPage />;
      case 'product-details': return <ProductDetailPage />;
      case 'cart': return <CartPage />;
      case 'wishlist': return <WishlistPage />;
      case 'checkout': return <CheckoutPage />;
      case 'order-tracking': return <OrderTrackingPage />;
      case 'orders': return currentUser ? <OrdersPage /> : signInRequired;
      case 'account': return <AccountPage />;
      case 'auth': return <AuthPage />;
      case 'admin':
        return currentUser?.role === 'admin'
          ? <AdminDashboard />
          : (
            <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Admin Portal Access</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                You are currently viewing the store as a visitor. Click below to enter the Admin Dashboard in Review / Demo mode.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <button
                  onClick={() => loginAsDemoAdmin()}
                  className="px-5 py-2.5 bg-purple-700 text-white rounded-xl text-xs font-bold hover:bg-purple-800 transition shadow-lg shadow-purple-700/25 active:scale-95"
                >
                  ⚡ Enter as Admin (Instant Preview)
                </button>
                <button
                  onClick={() => setPage('auth')}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
                >
                  Sign In with Account
                </button>
              </div>
            </div>
          );
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'faq': return <FAQPage />;
      case 'warranty-policy': return <WarrantyPolicyPage />;
      case 'return-policy': return <ReturnPolicyPage />;
      case 'shipping-policy': return <ShippingPolicyPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] w-full overflow-x-hidden">
      <ViewModeBar />
      <Header />
      <main className="flex-1 w-full max-w-full">
        {renderActivePage()}
      </main>
      <Footer />

      {/* Floating Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold border backdrop-blur transition-all ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-100 border-rose-800'
                : toast.type === 'info'
                ? 'bg-slate-900/90 text-slate-100 border-slate-700'
                : 'bg-purple-950/95 text-purple-100 border-purple-700/80'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            )}
            <span className="flex-1">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// export default function App() {
//   // Check for client preview key via URL parameter (?preview=time4preview) or saved session
//   const [bypassed, setBypassed] = React.useState<boolean>(() => {
//     if (typeof window === 'undefined')
//        return true;
//     const params = new URLSearchParams(window.location.search);

//     // Support ?preview=lock to re-enable Coming Soon page
//     if (params.get('preview') === 'lock') {
//       sessionStorage.removeItem('t4l_preview_unlocked');
//       return false;
//     }

//     const hasSecret = params.get('preview') === 'time4preview';
//     if (hasSecret) {
//       sessionStorage.setItem('t4l_preview_unlocked', 'true');
//       return true;
//     }
//     return true; // Default to site active
//   });

//   const handleUnlock = () => {
//     sessionStorage.setItem('t4l_preview_unlocked', 'true');
//     setBypassed(true);
//   };

//   const handleLock = () => {
//     sessionStorage.removeItem('t4l_preview_unlocked');
//     setBypassed(false);
//     const url = new URL(window.location.href);
//     url.searchParams.delete('preview');
//     window.history.replaceState({}, '', url.toString());
//   };

//   if (IS_COMING_SOON && !bypassed) {
//     return <ComingSoonPage onUnlock={handleUnlock} />;
//   }

//   return (
//     <StoreProvider>
//       <AppContent />
//     </StoreProvider>
//   );
// }
export default function App() {
  // Check for client preview key via URL parameter (?preview=time4preview) or saved session
  const [bypassed, setBypassed] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;

    const params = new URLSearchParams(window.location.search);

    // Support ?preview=lock to force Coming Soon page again
    if (params.get('preview') === 'lock') {
      sessionStorage.removeItem('t4l_preview_unlocked');
      return false;
    }

    // Unlock with secret key
    const hasSecret = params.get('preview') === 'time4preview';
    if (hasSecret) {
      sessionStorage.setItem('t4l_preview_unlocked', 'true');
      return true;
    }

    // Keep unlocked if previously unlocked in this browser session
    if (sessionStorage.getItem('t4l_preview_unlocked') === 'true') {
      return true;
    }

    // Default → show Coming Soon
    return false;
  });

  const handleUnlock = () => {
    sessionStorage.setItem('t4l_preview_unlocked', 'true');
    setBypassed(true);
  };

  const handleLock = () => {
    sessionStorage.removeItem('t4l_preview_unlocked');
    setBypassed(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('preview');
    window.history.replaceState({}, '', url.toString());
  };

  // Show Coming Soon when enabled and not bypassed
  if (IS_COMING_SOON && !bypassed) {
    return <ComingSoonPage onUnlock={handleUnlock} />;
  }

  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}