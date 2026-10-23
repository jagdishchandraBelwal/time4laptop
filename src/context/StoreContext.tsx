import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductCategory, CartItem, Order, User, Coupon, PageView, PaymentMethod, EmiTenure, UserAddress } from '../types';
import { allProducts } from '../data/products';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  currentUser: User | null;
  authLoading: boolean;
  page: PageView;
  selectedCategory: ProductCategory;
  selectedProductId: string | null;
  trackingOrderId: string | null;
  searchQuery: string;
  toasts: ToastMessage[];
  
  // Navigation
  setPage: (page: PageView) => void;
  navigateToCategory: (category: ProductCategory) => void;
  navigateToProduct: (productId: string) => void;
  navigateToTracking: (orderId: string) => void;
  setSearchQuery: (query: string) => void;

  // Cart actions
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSpec?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartGrandTotal: number;

  // Wishlist actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (productId: string) => void;

  // Orders
  placeOrder: (shippingAddress: any, paymentMethod: PaymentMethod, emiMonths?: EmiTenure) => Order;
  cancelOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrderPaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;

  // Admin Product & Coupon Management
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  // Auth
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loginAsDemoAdmin: () => void;
  promoteUserRole: (userId: string, newRole: 'customer' | 'admin', userEmail?: string) => Promise<void>;

  // User Profile & Addresses
  updateProfile: (profileData: { name: string; phone: string }) => Promise<void>;
  addAddress: (address: Omit<UserAddress, 'id'>) => Promise<void>;
  updateAddress: (addressId: string, address: Partial<UserAddress>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;

  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const DEFAULT_COUPONS: Coupon[] = [
  { code: 'TIME4LAPTOP10', discountPercent: 10, minOrder: 1000, description: '10% Instant Discount on orders over ₹1,000' },
  { code: 'WELCOME500', discountAmount: 500, minOrder: 5000, description: 'Flat ₹500 OFF on your first electronic purchase' },
  { code: 'GAMERPRO', discountAmount: 2000, minOrder: 40000, description: 'Flat ₹2,000 OFF on Gaming Rigs & Laptops' }
];

const DEFAULT_SAMPLE_ADDRESSES: UserAddress[] = [
  {
    id: 'addr-01',
    fullName: 'Rajesh Kumar Sharma',
    phone: '+91 98765 43210',
    addressLine: 'Flat 402, Shanti Heights, Near Lotus Temple, Nehru Place',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110019',
    type: 'Home',
    isDefault: true
  },
  {
    id: 'addr-02',
    fullName: 'Rajesh Sharma (IT Studio)',
    phone: '+91 98765 43210',
    addressLine: 'Tech Hub Towers, 5th Floor, Cyber City, DLF Phase 2',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    type: 'Work',
    isDefault: false
  }
];

const toStoreUser = (authUser: SupabaseUser | null, userAddresses: UserAddress[] = DEFAULT_SAMPLE_ADDRESSES): User | null => {
  if (!authUser) return null;

  const savedProfile = localStorage.getItem('time4laptop_user_profile');
  let customName = '';
  let customPhone = '';
  if (savedProfile) {
    try {
      const parsed = JSON.parse(savedProfile);
      customName = parsed.name;
      customPhone = parsed.phone;
    } catch (e) {}
  }

  const name = customName || (typeof authUser.user_metadata?.full_name === 'string'
    ? authUser.user_metadata.full_name
    : authUser.email?.split('@')[0] || 'Customer');
  const phone = customPhone || (typeof authUser.user_metadata?.phone === 'string'
    ? authUser.user_metadata.phone
    : '');

  return {
    id: authUser.id,
    name,
    email: authUser.email || '',
    phone,
    // Supabase app_metadata is managed by the project owner and cannot be edited by customers.
    role: authUser.app_metadata?.role === 'admin' ? 'admin' : 'customer',
    addresses: userAddresses
  };
};

const rebrandProduct = (product: Product): Product => {
  const rebrandAsset = (asset: string) => asset
    .replaceAll('MAHADEV INFOTECH', 'TIME4LAPTOP.COM')
    .replaceAll('MAHADEV', 'TIME4LAPTOP.COM');

  const preserveImagePayload = (asset: string) =>
    asset.startsWith('data:') && asset.includes(';base64,') ? asset : rebrandAsset(asset);

  return {
    ...product,
    name: product.name.replaceAll('Mahadev', 'Time4Laptop'),
    brand: product.brand.replaceAll('Mahadev', 'Time4Laptop'),
    image: preserveImagePayload(product.image),
    gallery: product.gallery.map(preserveImagePayload),
    specs: {
      ...product.specs,
      warranty: product.specs.warranty?.replaceAll('Mahadev Infotech', 'time4laptop.com'),
    },
  };
};

const refreshCatalogPhoto = (product: Product): Product => {
  const catalogProduct = allProducts.find(item => item.id === product.id);
  if (
    catalogProduct?.image.startsWith('/products/') &&
    product.image.startsWith('data:image/svg+xml')
  ) {
    return { ...product, image: catalogProduct.image, gallery: catalogProduct.gallery };
  }
  return product;
};

const rebrandCartItems = (items: CartItem[]): CartItem[] =>
  items.map(item => ({ ...item, product: rebrandProduct(refreshCatalogPhoto(item.product)) }));

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mahadev_products');
    if (saved) {
      try { return (JSON.parse(saved) as Product[]).map(refreshCatalogPhoto).map(rebrandProduct); } catch (e) { console.error(e); }
    }
    return allProducts;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mahadev_cart');
    if (saved) {
      try { return rebrandCartItems(JSON.parse(saved) as CartItem[]); } catch (e) { console.error(e); }
    }
    return [
      { product: allProducts[0], quantity: 1 },
      { product: allProducts.find(p => p.id === 'ms-01') || allProducts[18], quantity: 1 }
    ];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('mahadev_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ['lap-03', 'con-01', 'mob-03'];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mahadev_orders');
    if (saved) {
      try {
        const savedOrders: Order[] = JSON.parse(saved);
        return savedOrders
          .filter(order => !['MHD-89241', 'MHD-90412'].includes(order.id))
          .map(order => ({ ...order, items: rebrandCartItems(order.items) }));
      } catch (e) { console.error(e); }
    }
    return [];
  });

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>(() => {
    const saved = localStorage.getItem('time4laptop_saved_addresses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SAMPLE_ADDRESSES;
  });

  useEffect(() => {
    localStorage.setItem('time4laptop_saved_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  // Authentication is sourced from Supabase with local fallback profile
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedProfile = localStorage.getItem('time4laptop_user_profile');
    let name = 'Rajesh Kumar Sharma';
    let phone = '+91 98765 43210';
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        if (p.name) name = p.name;
        if (p.phone) phone = p.phone;
      } catch (e) {}
    }
    return {
      id: 'usr-customer-01',
      name,
      email: 'customer@time4laptop.com',
      phone,
      role: 'customer',
      addresses: DEFAULT_SAMPLE_ADDRESSES
    };
  });
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);

  // Sync addresses to currentUser
  useEffect(() => {
    setCurrentUser(prev => prev ? { ...prev, addresses: savedAddresses } : null);
  }, [savedAddresses]);

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('mahadev_coupons');
    if (saved) {
      try {
        const savedCoupons: Coupon[] = JSON.parse(saved);
        return savedCoupons.map(coupon => coupon.code === 'MAHADEV10' ? { ...coupon, code: 'TIME4LAPTOP10' } : coupon);
      } catch (e) { console.error(e); }
    }
    return DEFAULT_COUPONS;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Router State
  const [page, setPage] = useState<PageView>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('laptops');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('mahadev_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mahadev_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mahadev_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('mahadev_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    // Remove the old demo identity and load the real session from the auth provider.
    localStorage.removeItem('mahadev_user');
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(toStoreUser(session.user, savedAddresses));
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('mahadev_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Navigators
  const navigateToCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    setPage('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setPage('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTracking = (orderId: string) => {
    setTrackingOrderId(orderId);
    setPage('order-tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedColor?: string, selectedSpec?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor, selectedSpec }];
    });
    showToast(`Added "${product.name.slice(0, 28)}..." to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Coupon handling
  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find(c => c.code === clean);
    if (!found) {
      showToast('Invalid coupon code', 'error');
      return false;
    }
    if (cartSubtotal < found.minOrder) {
      showToast(`Coupon requires minimum order of ₹${found.minOrder.toLocaleString('en-IN')}`, 'error');
      return false;
    }
    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied successfully!`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Totals calculations
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      cartDiscount = appliedCoupon.discountAmount;
    }
  }

  // Free shipping above ₹999
  const cartDeliveryFee = cartSubtotal > 999 || cartSubtotal === 0 ? 0 : 99;
  const cartGrandTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to Wishlist!');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const moveToCartFromWishlist = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      setWishlist(prev => prev.filter(id => id !== productId));
    }
  };

  // Order Placement
  const placeOrder = (shippingAddress: any, paymentMethod: PaymentMethod, emiMonths?: EmiTenure): Order => {
    const randomId = 'MHD-' + Math.floor(10000 + Math.random() * 90000);
    const trackingNo = 'BD' + Math.floor(100000000 + Math.random() * 900000000) + 'IN';

    const newOrder: Order = {
      id: randomId,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryFee: cartDeliveryFee,
      total: cartGrandTotal,
      paymentMethod,
      emiMonths: paymentMethod === 'EMI' ? emiMonths : undefined,
      paymentStatus: paymentMethod === 'COD' || paymentMethod === 'EMI' ? 'Pending' : 'Paid',
      shippingAddress,
      status: 'Order Placed',
      trackingNumber: trackingNo,
      estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      courier: 'Blue Dart Express Air'
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    setTrackingOrderId(newOrder.id);
    showToast(paymentMethod === 'EMI'
      ? `EMI request ${newOrder.id} recorded. Payment is pending bank confirmation.`
      : `Order ${newOrder.id} placed successfully!`);
    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status: 'Cancelled' } : ord))
    );
    showToast(`Order ${orderId} has been cancelled`, 'info');
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`Order ${orderId} updated to ${status}`);
  };

  const updateOrderPaymentStatus = (orderId: string, status: Order['paymentStatus']) => {
    setOrders(prev => prev.map(ord => (ord.id === orderId ? { ...ord, paymentStatus: status } : ord)));
    showToast(`Payment status for ${orderId} updated to ${status}`);
  };

  // Admin Product Management
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newId = 'mhd-item-' + Date.now().toString().slice(-6);
    const newProd: Product = { ...prodData, id: newId };
    setProducts(prev => [newProd, ...prev]);
    showToast(`Product "${newProd.name.slice(0, 24)}..." created!`);
  };

  const editProduct = (product: Product) => {
    setProducts(prev => prev.map(p => (p.id === product.id ? product : p)));
    showToast(`Updated product "${product.name.slice(0, 24)}..."`);
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product deleted from inventory', 'info');
  };

  const updateProductStock = (productId: string, newStock: number) => {
    const safeStock = Math.max(0, newStock);
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, stockCount: safeStock, inStock: safeStock > 0 }
          : p
      )
    );
    showToast(`Stock updated to ${safeStock} units`);
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons(prev => [coupon, ...prev.filter(c => c.code !== coupon.code)]);
    showToast(`Coupon "${coupon.code}" created!`);
  };

  const deleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    showToast(`Coupon "${code}" deleted`, 'info');
  };

  // Auth
  const requireAuthClient = () => {
    if (!supabase) {
      throw new Error('Account login is not configured yet. Add the Supabase project URL and publishable key to .env.local.');
    }
    return supabase;
  };

  const login = async (email: string, password: string) => {
    const client = requireAuthClient();
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    if (error) throw error;

    setCurrentUser(toStoreUser(data.user));
    showToast(`Welcome back, ${data.user.user_metadata?.full_name || data.user.email || 'Customer'}!`);
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    const client = requireAuthClient();
    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim(), phone: phone.trim() },
        emailRedirectTo: window.location.origin
      }
    });
    if (error) throw error;

    if (data.session) {
      setCurrentUser(toStoreUser(data.user));
      showToast(`Account created! Welcome, ${name.trim()}!`);
      return false;
    }

    return true;
  };

  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e);
      }
    }
    setCurrentUser(null);
    showToast('Signed out successfully', 'info');
    setPage('home');
  };

  const promoteUserRole = async (userId: string, newRole: 'customer' | 'admin', userEmail?: string) => {
    if (supabase) {
      try {
        if (newRole === 'admin' && userEmail) {
          await supabase.rpc('make_user_admin', { user_email: userEmail });
        }
        await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', userId);
      } catch (err) {
        console.warn('Supabase role update error:', err);
      }
    }

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
    }
    showToast(`User role updated to ${newRole.toUpperCase()}!`, 'success');
  };

  const loginAsDemoAdmin = () => {
    const demoAdmin: User = {
      id: 'admin-demo-01',
      name: 'Time4Laptop Admin',
      email: 'admin@time4laptop.com',
      phone: '+91 98765 43210',
      role: 'admin',
      addresses: savedAddresses
    };
    setCurrentUser(demoAdmin);
    showToast('Logged in as Store Admin (Preview Mode)');
  };

  const updateProfile = async (profileData: { name: string; phone: string }) => {
    const trimmedName = profileData.name.trim();
    const trimmedPhone = profileData.phone.trim();

    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, name: trimmedName, phone: trimmedPhone } : null);
    }
    localStorage.setItem('time4laptop_user_profile', JSON.stringify({ name: trimmedName, phone: trimmedPhone }));

    if (supabase && currentUser) {
      try {
        await supabase.from('profiles').update({ name: trimmedName, phone: trimmedPhone }).eq('id', currentUser.id);
        await supabase.auth.updateUser({ data: { full_name: trimmedName, phone: trimmedPhone } });
      } catch (err) {
        console.warn('Supabase updateProfile error:', err);
      }
    }
    showToast('Profile details updated successfully!', 'success');
  };

  const addAddress = async (newAddr: Omit<UserAddress, 'id'>) => {
    const id = 'addr-' + Date.now().toString().slice(-6);
    const shouldBeDefault = newAddr.isDefault || savedAddresses.length === 0;

    const formatted: UserAddress = {
      ...newAddr,
      id,
      isDefault: shouldBeDefault
    };

    const updated = shouldBeDefault
      ? [formatted, ...savedAddresses.map(a => ({ ...a, isDefault: false }))]
      : [...savedAddresses, formatted];

    setSavedAddresses(updated);
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, addresses: updated } : null);
    }

    if (supabase && currentUser) {
      try {
        await supabase.from('addresses').insert([{
          id,
          user_id: currentUser.id,
          full_name: formatted.fullName,
          phone: formatted.phone,
          address_line: formatted.addressLine,
          city: formatted.city,
          state: formatted.state,
          pincode: formatted.pincode,
          address_type: formatted.type,
          is_default: formatted.isDefault
        }]);
      } catch (err) {
        console.warn('Supabase addAddress error:', err);
      }
    }
    showToast('Delivery address saved successfully!', 'success');
  };

  const updateAddress = async (addressId: string, updatedAddr: Partial<UserAddress>) => {
    const isNowDefault = updatedAddr.isDefault;
    const updated = savedAddresses.map(a => {
      if (a.id === addressId) {
        return { ...a, ...updatedAddr };
      }
      if (isNowDefault) {
        return { ...a, isDefault: false };
      }
      return a;
    });

    setSavedAddresses(updated);
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, addresses: updated } : null);
    }
    showToast('Address updated successfully!', 'success');
  };

  const deleteAddress = async (addressId: string) => {
    const toDelete = savedAddresses.find(a => a.id === addressId);
    let remaining = savedAddresses.filter(a => a.id !== addressId);

    // If deleted address was default, make the first remaining address default
    if (toDelete?.isDefault && remaining.length > 0) {
      remaining = remaining.map((a, idx) => idx === 0 ? { ...a, isDefault: true } : a);
    }

    setSavedAddresses(remaining);
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, addresses: remaining } : null);
    }
    showToast('Address deleted', 'info');
  };

  const setDefaultAddress = async (addressId: string) => {
    const updated = savedAddresses.map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));
    setSavedAddresses(updated);
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, addresses: updated } : null);
    }
    showToast('Default delivery address updated!', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        coupons,
        appliedCoupon,
        currentUser,
        authLoading,
        page,
        selectedCategory,
        selectedProductId,
        trackingOrderId,
        searchQuery,
        toasts,
        setPage,
        navigateToCategory,
        navigateToProduct,
        navigateToTracking,
        setSearchQuery,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        cartTotalCount,
        cartSubtotal,
        cartDiscount,
        cartDeliveryFee,
        cartGrandTotal,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        addProduct,
        editProduct,
        deleteProduct,
        updateProductStock,
        addCoupon,
        deleteCoupon,
        login,
        register,
        logout,
        loginAsDemoAdmin,
        promoteUserRole,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
