export type ProductCategory = 
  | 'laptops'
  | 'mobiles'
  | 'gaming'
  | 'ps5'
  | 'monitors'
  | 'keyboards'
  | 'mouse'
  | 'headphones'
  | 'chargers'
  | 'networking'
  | 'storage'
  | 'printers'
  | 'accessories';

export type ConditionGrade = 
  | 'Grade A - Like New' 
  | 'Grade B - Excellent' 
  | 'Grade C - Good' 
  | 'Grade D - Fair';

export type ProductStatus = 'Published' | 'Draft' | 'Out of Stock';

export interface Product {
  id: string;
  sku?: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subCategory?: string;
  conditionGrade?: ConditionGrade;
  warrantyMonths?: number;
  batteryHealth?: number; // e.g. 92%
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  badge?: string;
  image: string;
  gallery: string[];
  description: string;
  shortDescription?: string;
  status?: ProductStatus;
  specs: {
    processor?: string;
    ram?: string;
    storage?: string;
    graphics?: string;
    display?: string;
    refreshRate?: string;
    camera?: string;
    battery?: string;
    connectivity?: string;
    warranty?: string;
    color?: string;
    weight?: string;
    conditionNotes?: string;
    testedChecklist?: string;
    [key: string]: string | undefined;
  };
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSpec?: string;
}

export interface UserAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  type: 'Home' | 'Work';
}

export type PaymentMethod = 'UPI' | 'Card' | 'EMI' | 'COD' | 'NetBanking';
export type EmiTenure = 3 | 6 | 9 | 12;

export type OrderStatus = 
  | 'Order Placed' 
  | 'Order Confirmed' 
  | 'Packed' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled'
  | 'RMA Requested'
  | 'Returned';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  invoiceNumber?: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  emiMonths?: EmiTenure;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  shippingAddress: UserAddress;
  status: OrderStatus;
  statusHistory?: OrderStatusHistoryItem[];
  trackingNumber: string;
  trackingUrl?: string;
  estimatedDelivery: string;
  courier: string;
  returnReason?: string;
  adminNotes?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
  isApproved: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: UserAddress[];
  joinedDate?: string;
  totalSpent?: number;
  orderCount?: number;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrder: number;
  description: string;
  usageLimit?: number;
  timesUsed?: number;
  expiresAt?: string;
  isActive?: boolean;
}

export type PageView = 
  | 'home'
  | 'category'
  | 'product-details'
  | 'cart'
  | 'wishlist'
  | 'checkout'
  | 'order-tracking'
  | 'orders'
  | 'account'
  | 'auth'
  | 'admin'
  | 'about'
  | 'contact'
  | 'faq'
  | 'warranty-policy'
  | 'return-policy'
  | 'shipping-policy';
