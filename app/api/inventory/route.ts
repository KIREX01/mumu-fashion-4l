import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = `
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

    if (status && status !== "all") {
      const statusCondition =
        status === "In Stock"
          ? "p.stock > p.reorder_point AND p.stock <= p.max_stock"
          : status === "Low Stock"
            ? "p.stock > 0 AND p.stock <= p.reorder_point"
            : status === "Out of Stock"
              ? "p.stock = 0"
              : "p.stock > p.max_stock"

      query += ` WHERE ${statusCondition}`
    }

    query += " ORDER BY p.name"

    const inventory = await sql(query)
    return NextResponse.json(inventory)
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 })
  }
}
