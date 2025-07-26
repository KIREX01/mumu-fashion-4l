import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const categories = await sql`
      SELECT id, name, description, status, created_at,
             (SELECT COUNT(*) FROM products WHERE category_id = categories.id) as product_count
      FROM categories 
      ORDER BY name
    `
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    const [category] = await sql`
      INSERT INTO categories (name, description)
      VALUES (${name}, ${description})
      RETURNING *
    `

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
