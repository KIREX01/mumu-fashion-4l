import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = `
      SELECT o.*, c.name as customer_name, c.email as customer_email,
             a.street, a.city, a.state, a.zip_code, a.country,
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN addresses a ON o.shipping_address_id = a.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `

    if (status && status !== "all") {
      query += ` WHERE o.status = '${status}'`
    }

    query += ` GROUP BY o.id, c.name, c.email, a.street, a.city, a.state, a.zip_code, a.country ORDER BY o.order_date DESC`

    const orders = await sql(query)
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
