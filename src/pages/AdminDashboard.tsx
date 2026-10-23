import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  Search, 
  Check, 
  AlertTriangle,
  X,
  Upload,
  Download,
  Database,
  ExternalLink,
  Eye,
  FileText,
  Printer,
  ChevronRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Star
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory, Order, Coupon, User, Review, ConditionGrade, ProductStatus } from '../types';
import { CATEGORIES } from '../data/products';
import { getProductPlaceholder } from '../utils/productImages';
import { compressProductPhoto } from '../utils/compressProductPhoto';
import { adminService } from '../services/adminService';
import { uploadProductImage } from '../services/storageService';
import { reviewService } from '../services/reviewService';
import { InvoiceModal } from '../components/InvoiceModal';

const createEmptyProductForm = () => ({
  name: '',
  brand: '',
  sku: 'T4L-' + Math.floor(1000 + Math.random() * 9000),
  category: 'laptops' as ProductCategory,
  subCategory: 'Flagship',
  conditionGrade: 'Grade A - Like New' as ConditionGrade,
  batteryHealth: 92,
  price: 49999,
  originalPrice: 59999,
  stockCount: 15,
  description: '',
  processor: '',
  ram: '',
  storage: '',
  display: '',
  warranty: '1 Year Certified Refurbished Warranty',
  status: 'Published' as ProductStatus,
  imageUrl: '',
  uploadedImage: ''
});

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    orders, 
    coupons, 
    addProduct, 
    editProduct, 
    deleteProduct, 
    updateProductStock,
    addCoupon,
    deleteCoupon,
    updateOrderStatus,
    updateOrderPaymentStatus,
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons' | 'customers' | 'reviews' | 'settings'>('overview');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [reviews, setReviews] = useState<Review[]>(() => reviewService.getAllReviewsForAdmin());
  
  // Filter & Search states
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>('all');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  // New Product Form State
  const [formData, setFormData] = useState(createEmptyProductForm);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState('');

  // New Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(10);
  const [couponMinOrder, setCouponMinOrder] = useState<number>(1000);
  const [couponDesc, setCouponDesc] = useState('');

  // Customers State
  const [customers, setCustomers] = useState<User[]>([]);

  useEffect(() => {
    adminService.getCustomers().then(setCustomers);
  }, []);

  const backendMode = adminService.getBackendMode();

  // Calculate KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const pendingRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Pending' ? o.total : 0), 0);
  const lowStockProducts = products.filter(p => p.stockCount <= 8);
  const outOfStockProducts = products.filter(p => p.stockCount === 0);

  // Product Filters
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    
    const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;

    let matchesStock = true;
    if (productStockFilter === 'in-stock') matchesStock = p.stockCount > 8;
    if (productStockFilter === 'low-stock') matchesStock = p.stockCount > 0 && p.stockCount <= 8;
    if (productStockFilter === 'out-of-stock') matchesStock = p.stockCount === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Order Filters
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress.city.toLowerCase().includes(orderSearch.toLowerCase());
    
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesPayment = orderPaymentFilter === 'all' || o.paymentStatus === orderPaymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Handlers
  const handleUserRoleChange = async (userId: string, newRole: 'customer' | 'admin', email?: string) => {
    try {
      await adminService.updateUserRole(userId, newRole, email);
      setCustomers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showToast(`User ${email || userId} is now an ${newRole.toUpperCase()}!`, 'success');
    } catch (e) {
      showToast('Could not update user role', 'error');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productImage = formData.uploadedImage || formData.imageUrl.trim() || getProductPlaceholder(formData.category, formData.name, formData.brand);
    
    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: formData.name,
        brand: formData.brand,
        sku: formData.sku,
        category: formData.category,
        conditionGrade: formData.conditionGrade,
        batteryHealth: Number(formData.batteryHealth),
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discountPercent: Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100),
        stockCount: Number(formData.stockCount),
        inStock: Number(formData.stockCount) > 0,
        description: formData.description,
        image: productImage,
        status: formData.status,
        specs: {
          ...editingProduct.specs,
          processor: formData.processor,
          ram: formData.ram,
          storage: formData.storage,
          display: formData.display,
          warranty: formData.warranty,
          conditionNotes: `${formData.conditionGrade} verified on 40-point diagnostics checklist.`
        }
      };

      editProduct(updated);
      await adminService.syncUpdateProduct(updated);
      setEditingProduct(null);
    } else {
      const newProdData = {
        name: formData.name,
        brand: formData.brand,
        sku: formData.sku || ('T4L-' + Math.floor(1000 + Math.random() * 9000)),
        category: formData.category,
        subCategory: formData.subCategory,
        conditionGrade: formData.conditionGrade,
        batteryHealth: Number(formData.batteryHealth),
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discountPercent: Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100),
        rating: 4.8,
        reviewsCount: 1,
        inStock: Number(formData.stockCount) > 0,
        stockCount: Number(formData.stockCount),
        image: productImage,
        gallery: [],
        description: formData.description || 'Certified refurbished IT hardware verified by time4laptop.com technicians.',
        status: formData.status,
        specs: {
          processor: formData.processor,
          ram: formData.ram,
          storage: formData.storage,
          display: formData.display,
          warranty: formData.warranty,
          testedChecklist: '40-Point Inspection Passed'
        }
      };

      addProduct(newProdData);
      await adminService.syncCreateProduct(newProdData);
      setIsAddModalOpen(false);
    }
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setPhotoError('');
    setFormData({
      name: p.name,
      brand: p.brand,
      sku: p.sku || ('T4L-' + p.id.toUpperCase()),
      category: p.category,
      subCategory: p.subCategory || '',
      conditionGrade: p.conditionGrade || 'Grade A - Like New',
      batteryHealth: p.batteryHealth || 92,
      price: p.price,
      originalPrice: p.originalPrice,
      stockCount: p.stockCount,
      description: p.description,
      processor: p.specs.processor || '',
      ram: p.specs.ram || '',
      storage: p.specs.storage || '',
      display: p.specs.display || '',
      warranty: p.specs.warranty || '1 Year Certified Refurbished Warranty',
      status: p.status || 'Published',
      imageUrl: p.image.startsWith('data:') ? '' : p.image,
      uploadedImage: p.image.startsWith('data:') ? p.image : ''
    });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoError('');
    setPhotoBusy(true);
    try {
      const uploadedImage = await uploadProductImage(file);
      setFormData(current => ({ ...current, uploadedImage, imageUrl: '' }));
      showToast('Photo uploaded successfully to Cloud Storage!');
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'Photo upload failed.');
    } finally {
      setPhotoBusy(false);
      event.target.value = '';
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const newCoupon: Coupon = {
      code: couponCode.trim().toUpperCase(),
      discountPercent: Number(couponDiscountPercent),
      minOrder: Number(couponMinOrder),
      description: couponDesc.trim() || `${couponDiscountPercent}% Instant Discount on orders over ₹${couponMinOrder.toLocaleString('en-IN')}`
    };

    addCoupon(newCoupon);
    setCouponCode('');
    setCouponDesc('');
    setIsCouponModalOpen(false);
  };

  const handleExportOrders = () => {
    const exportData = orders.map(o => ({
      'Order ID': o.id,
      'Date': o.date,
      'Customer Name': o.shippingAddress.fullName,
      'Phone': o.shippingAddress.phone,
      'City': o.shippingAddress.city,
      'State': o.shippingAddress.state,
      'Items Count': o.items.reduce((s, i) => s + i.quantity, 0),
      'Total Amount': o.total,
      'Payment Method': o.paymentMethod,
      'Payment Status': o.paymentStatus,
      'Order Status': o.status,
      'Tracking Number': o.trackingNumber,
      'Courier': o.courier
    }));
    adminService.exportToCSV(exportData, 'time4laptop-orders');
    showToast('Orders report downloaded as CSV');
  };

  const handleExportProducts = () => {
    const exportData = products.map(p => ({
      'Product ID': p.id,
      'Title': p.name,
      'Brand': p.brand,
      'Category': p.category,
      'Selling Price': p.price,
      'MRP': p.originalPrice,
      'Stock Units': p.stockCount,
      'Status': p.inStock ? 'In Stock' : 'Out of Stock'
    }));
    adminService.exportToCSV(exportData, 'time4laptop-inventory');
    showToast('Inventory report downloaded as CSV');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Store Operations Portal</span>

            {/* Backend Connection Status Badge */}
            <button
              onClick={() => setIsDbModalOpen(true)}
              className={`ml-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all hover:scale-105 ${
                backendMode === 'supabase'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
              title="Click to view API & Database Connection Guide"
            >
              <Database className="w-3 h-3" />
              <span>{backendMode === 'supabase' ? '🟢 Supabase Live' : '🟡 Local Mode (Ready for API)'}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            time4laptop.com Admin Dashboard
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={activeTab === 'orders' ? handleExportOrders : handleExportProducts}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-300"
            title="Download report as CSV"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData(createEmptyProductForm());
              setPhotoError('');
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-700/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
          { id: 'products', label: `Inventory & Products (${products.length})`, icon: Package },
          { id: 'orders', label: `Customer Orders (${orders.length})`, icon: ShoppingCart },
          { id: 'coupons', label: `Discount Coupons (${coupons.length})`, icon: Tag },
          { id: 'customers', label: `Customers & Staff (${customers.length})`, icon: Users },
          { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
          { id: 'settings', label: 'Store Settings & Roles', icon: ShieldCheck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-purple-700 text-purple-700 bg-purple-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sales Revenue</span>
              <p className="text-2xl font-black text-slate-900 tabular-nums">₹{totalRevenue.toLocaleString('en-IN')}</p>
              <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100">
                <span className="text-emerald-600 font-bold">✓ Paid: ₹{totalRevenue.toLocaleString('en-IN')}</span>
                <span className="text-slate-400">Pending: ₹{pendingRevenue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Customer Orders</span>
              <p className="text-2xl font-black text-slate-900 tabular-nums">{orders.length}</p>
              <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100">
                <span className="text-purple-700 font-bold">{orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length} in fulfillment</span>
                <span className="text-slate-400">{orders.filter(o => o.status === 'Delivered').length} delivered</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active SKUs in Catalog</span>
              <p className="text-2xl font-black text-slate-900 tabular-nums">{products.length}</p>
              <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100">
                <span className="text-slate-600 font-semibold">{CATEGORIES.length} active departments</span>
                <span className="text-emerald-600 font-bold">{products.length - outOfStockProducts.length} in stock</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock Inventory Alerts</span>
              <p className="text-2xl font-black text-amber-600 tabular-nums">{lowStockProducts.length}</p>
              <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100">
                <span className="text-amber-700 font-medium">≤ 8 units left</span>
                {outOfStockProducts.length > 0 && (
                  <span className="text-rose-600 font-bold">{outOfStockProducts.length} out of stock</span>
                )}
              </div>
            </div>
          </div>

          {/* Urgent Low Stock Inventory Reorder Panel */}
          {lowStockProducts.length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-200/80 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Urgent Inventory Reorder Required ({lowStockProducts.length} Items)</span>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('products');
                    setProductStockFilter('low-stock');
                  }}
                  className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                >
                  <span>View All in Inventory</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {lowStockProducts.slice(0, 6).map(p => (
                  <div key={p.id} className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{p.name}</p>
                      <p className="text-slate-500 font-mono text-[11px]">{p.brand} · ₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 font-bold rounded text-[10px] ${
                        p.stockCount === 0 ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                      }`}>
                        {p.stockCount} left
                      </span>
                      <button
                        onClick={() => updateProductStock(p.id, p.stockCount + 10)}
                        className="px-2 py-1 bg-purple-700 text-white rounded text-[10px] font-bold hover:bg-purple-800 transition"
                        title="Restock +10 units"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recent Customer Orders
              </h2>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
              >
                <span>Manage All Orders ({orders.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Fulfillment Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map(o => (
                    <tr key={o.id} className="hover:bg-purple-50/20">
                      <td className="p-3 font-mono font-bold text-purple-700">{o.id}</td>
                      <td className="p-3 font-medium text-slate-900">{o.shippingAddress.fullName}</td>
                      <td className="p-3 font-bold tabular-nums">₹{o.total.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-semibold">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="px-2.5 py-1 text-purple-700 hover:bg-purple-50 rounded text-xs font-bold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRODUCTS & INVENTORY */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Product Catalog Inventory ({filteredProducts.length} Items)
              </h2>
              <p className="text-xs text-slate-500">Manage hardware pricing, stock levels, and specifications.</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products or brand..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-purple-600"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
              >
                <option value="all">All Departments</option>
                {CATEGORIES.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>

              <select
                value={productStockFilter}
                onChange={(e) => setProductStockFilter(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
              >
                <option value="all">All Stock Statuses</option>
                <option value="in-stock">In Stock (&gt; 8 units)</option>
                <option value="low-stock">Low Stock (1 - 8 units)</option>
                <option value="out-of-stock">Out of Stock (0 units)</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock Units</th>
                  <th className="p-3 text-center">Quick Stock Adjust</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.image} 
                          alt="" 
                          className="w-10 h-10 object-contain rounded bg-slate-50 p-1 border border-slate-200 shrink-0" 
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate max-w-xs">{p.name}</p>
                          <span className="text-[10px] text-purple-700 font-bold uppercase">{p.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 uppercase text-[11px] font-semibold text-slate-600">{p.category}</td>
                    <td className="p-3 font-bold text-slate-900 tabular-nums">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        p.stockCount === 0
                          ? 'bg-rose-100 text-rose-800'
                          : p.stockCount <= 5
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stockCount} units
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                        <button
                          onClick={() => updateProductStock(p.id, p.stockCount - 1)}
                          disabled={p.stockCount <= 0}
                          className="w-6 h-6 rounded flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                          title="Reduce 1 unit"
                        >
                          -
                        </button>
                        <span className="px-2 text-[11px] font-bold font-mono">{p.stockCount}</span>
                        <button
                          onClick={() => updateProductStock(p.id, p.stockCount + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200"
                          title="Add 1 unit"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 hover:bg-purple-100 text-purple-700 rounded transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Delete "${p.name}"?`)) {
                              deleteProduct(p.id);
                              await adminService.syncDeleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-100 text-rose-600 rounded transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CUSTOMER ORDERS */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Customer Orders ({filteredOrders.length})
              </h2>
              <p className="text-xs text-slate-500">Track shipments, update statuses, and inspect invoices.</p>
            </div>

            {/* Order Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order ID or customer..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-purple-600"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
              >
                <option value="all">All Order Statuses</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select
                value={orderPaymentFilter}
                onChange={(e) => setOrderPaymentFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
              >
                <option value="all">All Payment Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Fulfillment Status</th>
                  <th className="p-3 text-right">Invoice & Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-purple-50/20">
                    <td className="p-3 font-mono font-bold text-purple-700">{o.id}</td>
                    <td className="p-3 text-slate-500">{o.date}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{o.shippingAddress.fullName}</p>
                      <p className="text-[11px] text-slate-400">{o.shippingAddress.city}, {o.shippingAddress.state}</p>
                    </td>
                    <td className="p-3 font-bold text-slate-900 tabular-nums">₹{o.total.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <select
                        aria-label={`Payment status for order ${o.id}`}
                        value={o.paymentStatus}
                        onChange={(e) => updateOrderPaymentStatus(o.id, e.target.value as 'Paid' | 'Pending')}
                        className={`px-2 py-1 text-[11px] font-bold rounded-lg border focus:outline-none ${
                          o.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value as any;
                          updateOrderStatus(o.id, newStatus);
                          await adminService.syncUpdateOrderStatus(o.id, newStatus);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-purple-900 focus:outline-none focus:border-purple-600"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Order Confirmed">Order Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: COUPONS */}
      {/* ========================================================================= */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Active Store Promo Coupons ({coupons.length})
              </h2>
              <p className="text-xs text-slate-500">Create discount coupons to boost customer conversion.</p>
            </div>

            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {coupons.map(c => (
              <div key={c.code} className="p-5 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-3 relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-base font-black text-purple-900 tracking-wider">{c.code}</span>
                    <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
                      {c.discountPercent ? `${c.discountPercent}% Instant Discount` : `Flat ₹${c.discountAmount} OFF`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete coupon "${c.code}"?`)) {
                        deleteCoupon(c.code);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 transition"
                    title="Delete coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">{c.description}</p>

                <div className="pt-2 border-t border-purple-200/60 flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Min. Order: ₹{c.minOrder.toLocaleString('en-IN')}</span>
                  <span className="text-emerald-700 font-bold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CUSTOMERS & PROFILES */}
      {/* ========================================================================= */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Store Users & Staff Management ({customers.length})
              </h2>
              <p className="text-xs text-slate-500">Manage customer accounts and assign store administrative privileges.</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl text-xs text-purple-900 font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span>Role-Based Access Control (RBAC) Active</span>
            </div>
          </div>

          {/* Quick SQL Promotion Guide for Supabase */}
          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs space-y-2 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>How to Make a User Admin in Supabase SQL Editor:</span>
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">1-Click SQL</span>
            </div>
            <code className="block bg-slate-950 p-2.5 rounded font-mono text-emerald-400 text-[11px] overflow-x-auto">
              SELECT public.make_user_admin('customer_email@example.com');
            </code>
            <p className="text-[11px] text-slate-400">
              Or use the interactive buttons below to instantly promote/demote any registered user right here from the UI!
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3 text-right">Make Admin / Role Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map(u => (
                  <tr key={u.id} className="hover:bg-purple-50/20">
                    <td className="p-3 font-mono text-[11px] text-slate-500">{u.id}</td>
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 font-mono text-slate-600">{u.email}</td>
                    <td className="p-3 text-slate-600">{u.phone || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                        u.role === 'admin' 
                          ? 'bg-purple-100 text-purple-900 border border-purple-200' 
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {u.role === 'admin' ? '⚡ Store Admin' : '👤 Customer'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        {u.role !== 'admin' ? (
                          <button
                            onClick={() => handleUserRoleChange(u.id, 'admin', u.email)}
                            className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95"
                            title="Promote this user to Store Admin"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Make Admin</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserRoleChange(u.id, 'customer', u.email)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-semibold border border-slate-200 transition"
                            title="Demote back to regular customer"
                          >
                            <span>Revoke Admin</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: REVIEWS MODERATION */}
      {/* ========================================================================= */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Customer Reviews & Ratings Moderation ({reviews.length})
              </h2>
              <p className="text-xs text-slate-500">Approve or reject customer reviews to ensure trusted refurbished feedback.</p>
            </div>
          </div>

          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="p-4 border border-slate-200 rounded-xl space-y-2 hover:border-purple-200 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{r.userName}</span>
                    <span className="text-slate-400">· {r.date}</span>
                    <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-mono text-[10px]">Product: {r.productId}</span>
                    {r.verifiedPurchase && (
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.isApproved ? 'Approved & Public' : 'Pending Moderation'}
                    </span>
                    <button
                      onClick={() => {
                        const updated = reviewService.toggleReviewApproval(r.id);
                        setReviews(updated);
                        showToast(`Review ${r.isApproved ? 'hidden' : 'approved for display'}`);
                      }}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      {r.isApproved ? 'Reject / Hide' : 'Approve'}
                    </button>
                    <button
                      onClick={() => {
                        const updated = reviewService.deleteReview(r.id);
                        setReviews(updated);
                        showToast('Review deleted', 'info');
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex text-amber-500 text-xs">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <h4 className="font-bold text-slate-900 text-xs">{r.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: STORE SETTINGS & ROLES */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Store Configuration & System Health
            </h2>
            <p className="text-xs text-slate-500">Business credentials, backend connection status, and operational controls.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-700" />
                <span>Database & Supabase Connection</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Backend Status: <strong className={backendMode === 'supabase' ? 'text-emerald-700' : 'text-amber-700'}>
                  {backendMode === 'supabase' ? 'Connected to Live Supabase PostgreSQL' : 'Local Fallback Mode Active'}
                </strong>
              </p>
              <p className="text-slate-500 text-[11px]">
                To activate Supabase live mode, add your <code className="font-mono font-bold">VITE_SUPABASE_URL</code> and <code className="font-mono font-bold">VITE_SUPABASE_PUBLISHABLE_KEY</code> in <code className="font-mono font-bold">.env.local</code>.
              </p>
              <button
                onClick={() => setIsDbModalOpen(true)}
                className="px-3.5 py-1.5 bg-purple-700 text-white rounded-lg font-bold hover:bg-purple-800 transition"
              >
                View Setup Guide
              </button>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Business & Tax Information</span>
              </h3>
              <div className="space-y-1 text-slate-600">
                <p><strong>Store Name:</strong> Time4Laptop (time4laptop.com)</p>
                <p><strong>GSTIN:</strong> 07AAACT4L101Z5 (18% IT Hardware standard)</p>
                <p><strong>Support Helpline:</strong> +91 98765 43210 (10 AM – 7 PM IST)</p>
                <p><strong>Hub Location:</strong> Nehru Place IT Market, New Delhi - 110019</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================================================= */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Edit IT Hardware' : 'Add New Hardware to Catalog'}
              </h3>
              <button
                onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-semibold text-slate-700">Product Photo</label>
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <img
                    src={formData.uploadedImage || formData.imageUrl || getProductPlaceholder(formData.category, formData.name, formData.brand)}
                    alt="Product preview"
                    className="h-20 w-20 shrink-0 rounded-lg border border-slate-200 bg-white object-contain p-1"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-purple-700 px-3 py-2 font-bold text-white hover:bg-purple-800">
                      <Upload className="h-4 w-4" />
                      {photoBusy ? 'Preparing photo…' : 'Choose photo'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={photoBusy}
                        onChange={handlePhotoUpload}
                        className="sr-only"
                      />
                    </label>
                    <p className="text-[10px] text-slate-500">JPG, PNG, or WebP · up to 8 MB</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="product-photo-url" className="text-[11px] font-medium text-slate-600">Or use a direct image link</label>
                  <input
                    id="product-photo-url"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(event) => {
                      setFormData(current => ({ ...current, imageUrl: event.target.value, uploadedImage: '' }));
                      setPhotoError('');
                    }}
                    placeholder="https://example.com/product-photo.jpg"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  />
                </div>
                {photoError && <p role="alert" className="text-[11px] text-rose-700">{photoError}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. ASUS ROG Strix G16 RTX 4070"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Brand *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. ASUS / Apple / Dell"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Department *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">MRP Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Processor / Chip</label>
                  <input
                    type="text"
                    value={formData.processor}
                    onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                    placeholder="Intel i7 14700HX / Apple M3"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">RAM Memory</label>
                  <input
                    type="text"
                    value={formData.ram}
                    onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                    placeholder="16GB DDR5 5600MHz"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={photoBusy}
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold shadow"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ORDER DETAILS & INVOICE */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">Order {selectedOrder.id}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Placed on {selectedOrder.date}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Customer Details</span>
                <p className="font-bold text-slate-900 mt-1">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-slate-600">Phone: {selectedOrder.shippingAddress.phone}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Shipping Address</span>
                <p className="text-slate-700 mt-1">
                  {selectedOrder.shippingAddress.addressLine}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </p>
                <p className="text-purple-700 font-semibold mt-1">
                  Courier: {selectedOrder.courier} · {selectedOrder.trackingNumber}
                </p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Order Items</span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.product.image} alt="" className="w-10 h-10 object-contain rounded bg-slate-50 p-1 border border-slate-200 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                        <p className="text-[11px] text-slate-500">Qty: {item.quantity} · Unit Price: ₹{item.product.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>-₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery:</span>
                <span>{selectedOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedOrder.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total:</span>
                <span className="text-purple-700">₹{selectedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Invoice</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE COUPON */}
      {/* ========================================================================= */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Promo Coupon</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI2026 / LAPTOP50"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Discount Percentage (%) *</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  required
                  value={couponDiscountPercent}
                  onChange={(e) => setCouponDiscountPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Minimum Order Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={couponMinOrder}
                  onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 10% Instant Discount on orders above ₹1,000"
                  value={couponDesc}
                  onChange={(e) => setCouponDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 text-white rounded-lg font-bold hover:bg-purple-800"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DATABASE & API CONNECTION GUIDE */}
      {/* ========================================================================= */}
      {isDbModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Database & Backend Integration</h3>
                  <p className="text-xs text-slate-500">Plug-and-play architecture configured for Time4Laptop</p>
                </div>
              </div>
              <button onClick={() => setIsDbModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-1">
                <span className="font-bold text-purple-900">Current Status: {backendMode === 'supabase' ? '🟢 Supabase Active' : '🟡 In-Memory Local Mode'}</span>
                <p className="text-slate-600 leading-relaxed">
                  All UI operations (Add, Edit, Delete, Stock Update, Order Management) go through <code className="bg-purple-100 px-1 py-0.5 rounded font-mono text-[11px]">src/services/adminService.ts</code>.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">How to Connect Supabase (PostgreSQL) in 2 Minutes:</h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
                  <li>Create a free project at <strong>supabase.com</strong>.</li>
                  <li>Go to <strong>SQL Editor</strong> &gt; Run the schema inside <code className="bg-slate-100 px-1 font-mono">supabase/schema.sql</code>.</li>
                  <li>In your <code className="bg-slate-100 px-1 font-mono">.env</code>, add:
                    <pre className="bg-slate-950 text-slate-200 p-2.5 rounded-lg mt-1 font-mono text-[11px] overflow-x-auto">
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
                    </pre>
                  </li>
                  <li>Restart Vite (<code className="bg-slate-100 px-1 font-mono">npm run dev</code>). The app will automatically connect to Supabase!</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">How to Connect Any Custom REST API:</h4>
                <p className="text-slate-600 leading-relaxed">
                  Simply open <code className="bg-slate-100 px-1 font-mono">src/services/adminService.ts</code> and update the <code className="bg-slate-100 px-1 font-mono">fetch()</code> endpoints to call your Express / Django / Laravel backend.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsDbModalOpen(false)}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg text-xs font-bold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
