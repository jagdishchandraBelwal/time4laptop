import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, Order, Coupon, User } from '../types';

export type BackendMode = 'supabase' | 'rest-api' | 'local-state';

/**
 * Admin Service:
 * This abstraction layer handles all Admin CRUD operations.
 * When you connect a database (Supabase) or REST API backend,
 * you only need to update the methods in this file.
 */
class AdminService {
  /**
   * Determine the current active backend mode
   */
  getBackendMode(): BackendMode {
    if (isSupabaseConfigured && supabase) {
      return 'supabase';
    }
    if (import.meta.env.VITE_API_BASE_URL) {
      return 'rest-api';
    }
    return 'local-state';
  }

  /**
   * Check if real backend is configured
   */
  isLiveDatabase(): boolean {
    return this.getBackendMode() !== 'local-state';
  }

  /**
   * Fetch all registered customers
   */
  async getCustomers(): Promise<User[]> {
    if (this.getBackendMode() === 'supabase' && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((p: any) => ({
            id: p.id,
            name: p.name || 'Valued Customer',
            email: p.email,
            phone: p.phone || '',
            role: p.role || 'customer',
            addresses: []
          }));
        }
      } catch (err) {
        console.warn('Could not fetch profiles from Supabase, falling back to mock:', err);
      }
    }

    // Default Mock / Local Customers for testing
    return [
      { id: 'usr-01', name: 'Rohan Sharma', email: 'rohan.sharma@example.com', phone: '+91 98765 12345', role: 'customer', addresses: [] },
      { id: 'usr-02', name: 'Priya Patel', email: 'priya.patel@example.com', phone: '+91 98221 45678', role: 'customer', addresses: [] },
      { id: 'usr-03', name: 'Admin Store Manager', email: 'admin@time4laptop.com', phone: '+91 99000 88888', role: 'admin', addresses: [] },
      { id: 'usr-04', name: 'Vikram Sengupta', email: 'vikram.sen@example.com', phone: '+91 91234 56789', role: 'customer', addresses: [] },
      { id: 'usr-05', name: 'Ananya Verma', email: 'ananya.v@example.com', phone: '+91 98450 11223', role: 'customer', addresses: [] }
    ];
  }

  /**
   * Promote or demote user between customer and admin roles
   */
  async updateUserRole(userId: string, role: 'customer' | 'admin', userEmail?: string): Promise<boolean> {
    if (this.getBackendMode() === 'supabase' && supabase) {
      try {
        // If email provided, call the make_user_admin RPC or direct update
        if (role === 'admin' && userEmail) {
          const { data, error: rpcErr } = await supabase.rpc('make_user_admin', { user_email: userEmail });
          if (!rpcErr) return true;
        }

        const { error } = await supabase
          .from('profiles')
          .update({ role })
          .eq('id', userId);

        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase updateUserRole error:', err);
      }
    }
    return true; // Local state fallback
  }

  /**
   * Sync product create to backend database
   */
  async syncCreateProduct(product: Omit<Product, 'id'>): Promise<string | null> {
    if (this.getBackendMode() === 'supabase' && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([{
            name: product.name,
            brand: product.brand,
            category_id: product.category,
            sub_category: product.subCategory,
            price: product.price,
            original_price: product.originalPrice,
            discount_percent: product.discountPercent,
            stock_count: product.stockCount,
            in_stock: product.stockCount > 0,
            image: product.image,
            description: product.description,
            specs: product.specs
          }])
          .select('id')
          .single();

        if (error) throw error;
        return data?.id || null;
      } catch (err) {
        console.error('Supabase product sync error:', err);
      }
    }
    return null;
  }

  /**
   * Sync product update to backend database
   */
  async syncUpdateProduct(product: Product): Promise<boolean> {
    if (this.getBackendMode() === 'supabase' && supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .update({
            name: product.name,
            brand: product.brand,
            price: product.price,
            original_price: product.originalPrice,
            stock_count: product.stockCount,
            in_stock: product.stockCount > 0,
            description: product.description,
            image: product.image,
            specs: product.specs
          })
          .eq('id', product.id);

        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase update product error:', err);
      }
    }
    return false;
  }

  /**
   * Sync product delete to backend database
   */
  async syncDeleteProduct(productId: string): Promise<boolean> {
    if (this.getBackendMode() === 'supabase' && supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);

        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase delete product error:', err);
      }
    }
    return false;
  }

  /**
   * Sync order status update
   */
  async syncUpdateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    if (this.getBackendMode() === 'supabase' && supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', orderId);

        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase order status error:', err);
      }
    }
    return false;
  }

  /**
   * Export any data array to standard CSV file for Excel / accounting
   */
  exportToCSV(data: any[], filename: string) {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers
          .map(fieldName => {
            const val = row[fieldName];
            const strVal = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
            return `"${strVal.replace(/"/g, '""')}"`;
          })
          .join(',')
      )
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const adminService = new AdminService();
