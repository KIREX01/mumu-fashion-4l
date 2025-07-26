import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [order] = await sql`
      SELECT o.*, c.name as customer_name, c.email as customer_email,
             a.street, a.city, a.state, a.zip_code, a.country
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN addresses a ON o.shipping_address_id = a.id
      WHERE o.id = ${params.id}
    `

    const items = await sql`
      SELECT oi.*, p.name as product_name, p.sku
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${params.id}
    `

    return NextResponse.json({ order, items })
  } catch (error) {
    console.error("Error fetching order details:", error)
    return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status } = body

    const trackingNumber = status === "Shipped" ? `1Z999AA${Date.now()}` : null

    const [order] = await sql`
      UPDATE orders 
      SET status = ${status}, tracking_number = ${trackingNumber}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *
    `

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
