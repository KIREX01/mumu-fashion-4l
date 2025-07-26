"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Tag } from "lucide-react"

interface Category {
  id: string
  name: string
  description: string
  productCount: number
  status: "Active" | "Inactive"
  createdDate: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Dresses",
      description: "Elegant dresses for all occasions",
      productCount: 45,
      status: "Active",
      createdDate: "2024-01-01",
    },
    {
      id: "2",
      name: "Tops",
      description: "Stylish tops and blouses",
      productCount: 78,
      status: "Active",
      createdDate: "2024-01-01",
    },
    {
      id: "3",
      name: "Bottoms",
      description: "Pants, jeans, and skirts",
      productCount: 56,
      status: "Active",
      createdDate: "2024-01-01",
    },
    {
      id: "4",
      name: "Jackets",
      description: "Outerwear and jackets",
      productCount: 23,
      status: "Active",
      createdDate: "2024-01-01",
    },
    {
      id: "5",
      name: "Shoes",
      description: "Footwear collection",
      productCount: 34,
      status: "Active",
      createdDate: "2024-01-01",
    },
    {
      id: "6",
      name: "Accessories",
      description: "Bags, jewelry, and accessories",
      productCount: 67,
      status: "Active",
      createdDate: "2024-01-01",
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const handleAddCategory = (formData: FormData) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      productCount: 0,
      status: "Active",
      createdDate: new Date().toISOString().split("T")[0],
    }
    setCategories([...categories, newCategory])
    setIsAddDialogOpen(false)
  }

  const handleEditCategory = (formData: FormData) => {
    if (!editingCategory) return

    const updatedCategory: Category = {
      ...editingCategory,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    }

    setCategories(categories.map((cat) => (cat.id === editingCategory.id ? updatedCategory : cat)))
    setEditingCategory(null)
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id))
  }

  const toggleCategoryStatus = (id: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, status: cat.status === "Active" ? "Inactive" : "Active" } : cat,
      ),
    )
  }

  const totalCategories = categories.length
  const activeCategories = categories.filter((cat) => cat.status === "Active").length
  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Organize your products into categories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new product category for your store</DialogDescription>
            </DialogHeader>
            <form action={handleAddCategory}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">All categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
            <Tag className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCategories}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Tag className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>Manage your product categories and their organization</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground truncate">{category.description}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.productCount} products</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toggleCategoryStatus(category.id)}>
                      <Badge variant={category.status === "Active" ? "default" : "secondary"}>{category.status}</Badge>
                    </Button>
                  </TableCell>
                  <TableCell>{category.createdDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog
                        open={editingCategory?.id === category.id}
                        onOpenChange={(open) => !open && setEditingCategory(null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setEditingCategory(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>Update category information</DialogDescription>
                          </DialogHeader>
                          <form action={handleEditCategory}>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Category Name</Label>
                                <Input id="edit-name" name="name" defaultValue={category.name} required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                  id="edit-description"
                                  name="description"
                                  defaultValue={category.description}
                                  required
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Update Category</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={category.productCount > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
