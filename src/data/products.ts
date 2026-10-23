import { Product, ProductCategory } from '../types';
import { laptopProducts } from './laptopProducts';
import { mobileProducts } from './mobileProducts';
import { gamingConsoleProducts } from './gamingConsoleProducts';
import { accessoriesProducts } from './accessoriesProducts';

export const allProducts: Product[] = [
  ...laptopProducts,
  ...mobileProducts,
  ...gamingConsoleProducts,
  ...accessoriesProducts,
];

export interface CategoryInfo {
  slug: ProductCategory;
  name: string;
  shortDesc: string;
  itemCount: number;
}

export const CATEGORIES: CategoryInfo[] = [
  { slug: 'laptops', name: 'Laptops', shortDesc: 'Apple, HP, Dell, Lenovo, ASUS & Acer', itemCount: laptopProducts.length },
  { slug: 'mobiles', name: 'Mobiles', shortDesc: 'iPhones, Galaxy, OnePlus, Vivo & Xiaomi', itemCount: mobileProducts.length },
  { slug: 'gaming', name: 'Gaming Zone', shortDesc: 'Custom Rigs, RTX GPUs, Chairs & Coolers', itemCount: 6 },
  { slug: 'ps5', name: 'PS5 & Consoles', shortDesc: 'PlayStation 5, Xbox, Switch & Games', itemCount: 7 },
  { slug: 'monitors', name: 'Monitors', shortDesc: '240Hz Gaming, 4K UHD & Curved Displays', itemCount: 3 },
  { slug: 'keyboards', name: 'Keyboards', shortDesc: 'Mechanical, Wireless & RGB Gaming', itemCount: 3 },
  { slug: 'mouse', name: 'Mouse', shortDesc: 'Ergonomic Productivity & Esports Ultralight', itemCount: 3 },
  { slug: 'headphones', name: 'Headphones', shortDesc: 'Active Noise Cancelling & Spatial Gaming', itemCount: 3 },
  { slug: 'chargers', name: 'Chargers & Adapters', shortDesc: '100W GaN Fast Chargers & Original Adapters', itemCount: 2 },
  { slug: 'networking', name: 'Wi-Fi & Networking', shortDesc: 'Wi-Fi 6 Mesh Systems & Gaming Routers', itemCount: 2 },
  { slug: 'storage', name: 'Storage & RAM', shortDesc: 'Gen4 NVMe SSDs, Portable SSDs & DDR5 RAM', itemCount: 3 },
  { slug: 'printers', name: 'Printers', shortDesc: 'Smart All-in-One InkTank Wi-Fi Printers', itemCount: 2 },
  { slug: 'accessories', name: 'Computer Accessories', shortDesc: 'USB-C Hubs, 8K Cables, Webcams & Bags', itemCount: 5 },
];

export const TOP_BRANDS = [
  'Apple',
  'HP',
  'Dell',
  'Lenovo',
  'ASUS',
  'Acer',
  'MSI',
  'Sony',
  'Samsung',
  'OnePlus',
  'Vivo',
  'Xiaomi',
  'Logitech',
  'Razer',
  'Keychron',
  'Anker',
  'TP-Link',
  'SanDisk'
];
