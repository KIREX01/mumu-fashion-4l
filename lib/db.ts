import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Database query helpers
export async function getCategories() {
  return await sql`
    SELECT id, name, description, status, created_at,
           (SELECT COUNT(*) FROM products WHERE category_id = categories.id) as product_count
    FROM categories 
    ORDER BY name
  `
}

export async function getProducts(categoryFilter?: string, searchTerm?: string) {
  let query = sql`
    SELECT p.*, c.name as category_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `

  const conditions = []
  if (categoryFilter && categoryFilter !== "all") {
    conditions.push(sql`c.name = ${categoryFilter}`)
  }
  if (searchTerm) {
    conditions.push(sql`(p.name ILIKE ${"%" + searchTerm + "%"} OR p.sku ILIKE ${"%" + searchTerm + "%"})`)
  }

  if (conditions.length > 0) {
    query = sql`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${conditions.join(" AND ")}
    `
  }

  query = sql`${query} ORDER BY p.created_at DESC`
  return await query
}

export async function getOrders(statusFilter?: string) {
  let query = sql`
    SELECT o.*, c.name as customer_name, c.email as customer_email,
           a.street, a.city, a.state, a.zip_code, a.country,
           COUNT(oi.id) as item_count
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    LEFT JOIN addresses a ON o.shipping_address_id = a.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
  `

  if (statusFilter && statusFilter !== "all") {
    query = sql`${query} WHERE o.status = ${statusFilter}`
  }

  query = sql`${query} GROUP BY o.id, c.name, c.email, a.street, a.city, a.state, a.zip_code, a.country ORDER BY o.order_date DESC`
  return await query
}

export async function getOrderDetails(orderId: string) {
  const order = await sql`
    SELECT o.*, c.name as customer_name, c.email as customer_email,
           a.street, a.city, a.state, a.zip_code, a.country
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    LEFT JOIN addresses a ON o.shipping_address_id = a.id
    WHERE o.id = ${orderId}
  `

  const items = await sql`
    SELECT oi.*, p.name as product_name, p.sku
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ${orderId}
  `

  return { order: order[0], items }
}

export async function getInventoryItems(statusFilter?: string) {
  let query = sql`
    SELECT p.*, c.name as category_name,
           CASE 
             WHEN p.stock = 0 THEN 'Out of Stock'
             WHEN p.stock <= p.reorder_point THEN 'Low Stock'
             WHEN p.stock > p.max_stock THEN 'Overstock'
             ELSE 'In Stock'
           END as inventory_status
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `

  if (statusFilter && statusFilter !== "all") {
    const statusCondition =
      statusFilter === "In Stock"
        ? sql`p.stock > p.reorder_point AND p.stock <= p.max_stock`
        : statusFilter === "Low Stock"
          ? sql`p.stock > 0 AND p.stock <= p.reorder_point`
          : statusFilter === "Out of Stock"
            ? sql`p.stock = 0`
            : sql`p.stock > p.max_stock`

    query = sql`${query} WHERE ${statusCondition}`
  }

  query = sql`${query} ORDER BY p.name`
  return await query
}

export async function getDashboardStats() {
  const [productCount] = await sql`SELECT COUNT(*) as count FROM products`
  const [orderCount] = await sql`SELECT COUNT(*) as count FROM orders`
  const [customerCount] = await sql`SELECT COUNT(*) as count FROM customers`
  const [revenue] = await sql`SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'Cancelled'`

  const lowStockItems = await sql`
    SELECT name, stock, sku FROM products 
    WHERE stock <= reorder_point AND stock > 0
    ORDER BY stock ASC
    LIMIT 4
  `

  const recentOrders = await sql`
    SELECT o.order_number, c.name as customer_name, o.total, o.status
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    ORDER BY o.order_date DESC
    LIMIT 4
  `

  return {
    productCount: productCount.count,
    orderCount: orderCount.count,
    customerCount: customerCount.count,
    revenue: revenue.total,
    lowStockItems,
    recentOrders,
  }
}
