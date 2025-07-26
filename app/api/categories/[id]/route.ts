import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, description, status } = body

    const [category] = await sql`
      UPDATE categories 
      SET name = ${name}, description = ${description}, status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *
    `

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if category has products
    const [productCount] = await sql`SELECT COUNT(*) as count FROM products WHERE category_id = ${params.id}`

    if (productCount.count > 0) {
      return NextResponse.json({ error: "Cannot delete category with existing products" }, { status: 400 })
    }

    await sql`DELETE FROM categories WHERE id = ${params.id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
