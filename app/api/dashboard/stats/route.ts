import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
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

    return NextResponse.json({
      productCount: Number.parseInt(productCount.count),
      orderCount: Number.parseInt(orderCount.count),
      customerCount: Number.parseInt(customerCount.count),
      revenue: Number.parseFloat(revenue.total),
      lowStockItems,
      recentOrders,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
