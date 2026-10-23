-- ==============================================================================
-- time4laptop.com - Initial Seed Data
-- ==============================================================================

-- 1. Insert Categories
INSERT INTO public.categories (slug, name, short_desc, display_order) VALUES
('laptops', 'Laptops', 'Apple, HP, Dell, Lenovo, ASUS & Acer', 1),
('mobiles', 'Mobiles', 'iPhones, Galaxy, OnePlus, Vivo & Xiaomi', 2),
('gaming', 'Gaming Zone', 'Custom Rigs, RTX GPUs, Chairs & Coolers', 3),
('ps5', 'PS5 & Consoles', 'PlayStation 5, Xbox, Switch & Games', 4),
('monitors', 'Monitors', '240Hz Gaming, 4K UHD & Curved Displays', 5),
('keyboards', 'Keyboards', 'Mechanical, Wireless & RGB Gaming', 6),
('mouse', 'Mouse', 'Ergonomic Productivity & Esports Ultralight', 7),
('headphones', 'Headphones', 'Active Noise Cancelling & Spatial Gaming', 8),
('chargers', 'Chargers & Adapters', '100W GaN Fast Chargers & Original Adapters', 9),
('networking', 'Wi-Fi & Networking', 'Wi-Fi 6 Mesh Systems & Gaming Routers', 10),
('storage', 'Storage & RAM', 'Gen4 NVMe SSDs, Portable SSDs & DDR5 RAM', 11),
('printers', 'Printers', 'Smart All-in-One InkTank Wi-Fi Printers', 12),
('accessories', 'Computer Accessories', 'USB-C Hubs, 8K Cables, Webcams & Bags', 13)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Coupons
INSERT INTO public.coupons (code, discount_percent, discount_amount, min_order, description, is_active) VALUES
('TIME4LAPTOP10', 10, NULL, 1000, '10% Instant Discount on orders over ₹1,000', true),
('WELCOME500', NULL, 500, 5000, 'Flat ₹500 OFF on your first electronic purchase', true),
('GAMERPRO', NULL, 2000, 40000, 'Flat ₹2,000 OFF on Gaming Rigs & Laptops', true)
ON CONFLICT (code) DO NOTHING;
