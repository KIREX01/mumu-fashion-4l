import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `

    const conditions = []
    const params = []

    if (category && category !== "all") {
      conditions.push("c.name = $" + (params.length + 1))
      params.push(category)
    }

    if (search) {
      conditions.push("(p.name ILIKE $" + (params.length + 1) + " OR p.sku ILIKE $" + (params.length + 2) + ")")
      params.push(`%${search}%`, `%${search}%`)
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " ORDER BY p.created_at DESC"

    const products = await sql(query, params)
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      price,
      sku,
      category_id,
      sizes,
      colors,
      stock,
      min_stock,
      max_stock,
      reorder_point,
      supplier,
    } = body

    const [product] = await sql`
      INSERT INTO products (name, description, price, sku, category_id, sizes, colors, stock, min_stock, max_stock, reorder_point, supplier, last_restocked)
      VALUES (${name}, ${description}, ${price}, ${sku}, ${category_id}, ${sizes}, ${colors}, ${stock}, ${min_stock || 5}, ${max_stock || 100}, ${reorder_point || 10}, ${supplier}, CURRENT_DATE)
      RETURNING *
    `

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
