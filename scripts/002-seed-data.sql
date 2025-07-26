-- Seed initial data for Mumu Fashion System

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Dresses', 'Elegant dresses for all occasions'),
('Tops', 'Stylish tops and blouses'),
('Bottoms', 'Pants, jeans, and skirts'),
('Jackets', 'Outerwear and jackets'),
('Shoes', 'Footwear collection'),
('Accessories', 'Bags, jewelry, and accessories')
ON CONFLICT (name) DO NOTHING;

-- Insert sample customers
INSERT INTO customers (name, email, phone) VALUES
('Alice Johnson', 'alice@example.com', '+1-555-0101'),
('Bob Smith', 'bob@example.com', '+1-555-0102'),
('Carol Davis', 'carol@example.com', '+1-555-0103'),
('David Wilson', 'david@example.com', '+1-555-0104')
ON CONFLICT (email) DO NOTHING;

-- Insert sample addresses
INSERT INTO addresses (customer_id, street, city, state, zip_code, country, is_default) VALUES
(1, '123 Main St', 'New York', 'NY', '10001', 'USA', true),
(2, '456 Oak Ave', 'Los Angeles', 'CA', '90210', 'USA', true),
(3, '789 Pine St', 'Chicago', 'IL', '60601', 'USA', true),
(4, '321 Elm St', 'Houston', 'TX', '77001', 'USA', true);

-- Insert sample products
INSERT INTO products (name, description, price, sku, category_id, sizes, colors, stock, min_stock, max_stock, reorder_point, supplier, last_restocked) VALUES
('Summer Floral Dress', 'Beautiful floral print dress perfect for summer occasions', 89.99, 'SF001', 1, ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Blue', 'Pink', 'White'], 25, 10, 100, 15, 'Fashion Wholesale Co.', '2024-01-15'),
('Classic Denim Jacket', 'Timeless denim jacket with modern fit', 79.99, 'DJ002', 4, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue', 'Black', 'Light Blue'], 5, 8, 50, 12, 'Denim Masters Ltd.', '2024-01-10'),
('Cotton Basic T-Shirt', 'Comfortable cotton t-shirt for everyday wear', 24.99, 'CT003', 2, ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['White', 'Black', 'Gray', 'Navy'], 0, 20, 200, 30, 'Cotton Comfort Inc.', '2023-12-20'),
('Leather Ankle Boots', 'Premium leather boots with comfortable sole', 149.99, 'LB004', 5, ARRAY['6', '7', '8', '9', '10', '11'], ARRAY['Brown', 'Black'], 8, 5, 30, 8, 'Premium Leather Co.', '2024-01-12'),
('Silk Evening Gown', 'Luxurious silk gown for special occasions', 299.99, 'SEG005', 1, ARRAY['XS', 'S', 'M', 'L'], ARRAY['Black', 'Navy', 'Burgundy'], 12, 5, 25, 8, 'Luxury Fashion Inc.', '2024-01-18'),
('Casual Jeans', 'Comfortable straight-leg jeans', 59.99, 'CJ006', 3, ARRAY['28', '30', '32', '34', '36'], ARRAY['Blue', 'Black', 'Gray'], 30, 15, 80, 20, 'Denim Masters Ltd.', '2024-01-20');

-- Insert sample orders
INSERT INTO orders (order_number, customer_id, status, total, shipping_address_id, tracking_number, order_date) VALUES
('ORD001', 1, 'Processing', 89.99, 1, NULL, '2024-01-20'),
('ORD002', 2, 'Shipped', 156.50, 2, '1Z999AA1234567890', '2024-01-19'),
('ORD003', 3, 'Delivered', 234.00, 3, '1Z999AA1234567891', '2024-01-18'),
('ORD004', 4, 'Processing', 67.25, 4, NULL, '2024-01-21');

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, price, size, color) VALUES
(1, 1, 1, 89.99, 'M', 'Blue'),
(2, 2, 1, 79.99, 'L', 'Blue'),
(2, 3, 2, 24.99, 'L', 'White'),
(3, 4, 1, 149.99, '8', 'Brown'),
(3, 1, 1, 89.99, 'S', 'Pink'),
(4, 3, 1, 24.99, 'M', 'Black');
