"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Package, TrendingDown, TrendingUp } from "lucide-react"

interface InventoryItem {
  id: string
  productName: string
  sku: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  reorderPoint: number
  lastRestocked: string
  supplier: string
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Overstock"
}

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: "1",
      productName: "Summer Floral Dress",
      sku: "SF001",
      category: "Dresses",
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      reorderPoint: 15,
      lastRestocked: "2024-01-15",
      supplier: "Fashion Wholesale Co.",
      status: "In Stock",
    },
    {
      id: "2",
      productName: "Classic Denim Jacket",
      sku: "DJ002",
      category: "Jackets",
      currentStock: 5,
      minStock: 8,
      maxStock: 50,
      reorderPoint: 12,
      lastRestocked: "2024-01-10",
      supplier: "Denim Masters Ltd.",
      status: "Low Stock",
    },
    {
      id: "3",
      productName: "Cotton Basic T-Shirt",
      sku: "CT003",
      category: "Tops",
      currentStock: 0,
      minStock: 20,
      maxStock: 200,
      reorderPoint: 30,
      lastRestocked: "2023-12-20",
      supplier: "Cotton Comfort Inc.",
      status: "Out of Stock",
    },
    {
      id: "4",
      productName: "Leather Ankle Boots",
      sku: "LB004",
      category: "Shoes",
      currentStock: 8,
      minStock: 5,
      maxStock: 30,
      reorderPoint: 8,
      lastRestocked: "2024-01-12",
      supplier: "Premium Leather Co.",
      status: "In Stock",
    },
  ])

  const [filterStatus, setFilterStatus] = useState("all")

  const filteredItems = inventoryItems.filter((item) => filterStatus === "all" || item.status === filterStatus)

  const updateStock = (id: string, newStock: number) => {
    setInventoryItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          let status: InventoryItem["status"] = "In Stock"
          if (newStock === 0) status = "Out of Stock"
          else if (newStock <= item.reorderPoint) status = "Low Stock"
          else if (newStock > item.maxStock) status = "Overstock"

          return { ...item, currentStock: newStock, status }
        }
        return item
      }),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "default"
      case "Low Stock":
        return "secondary"
      case "Out of Stock":
        return "destructive"
      case "Overstock":
        return "outline"
      default:
        return "default"
    }
  }

  const totalItems = inventoryItems.length
  const lowStockItems = inventoryItems.filter((item) => item.status === "Low Stock").length
  const outOfStockItems = inventoryItems.filter((item) => item.status === "Out of Stock").length
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.currentStock * 50, 0) // Assuming avg price of $50

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">Track and manage your stock levels</p>
      </div>

      {/* Inventory Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">Urgent attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Estimated value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                <SelectItem value="Overstock">Overstock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min/Max</TableHead>
                <TableHead>Reorder Point</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">{item.supplier}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.currentStock}
                      onChange={(e) => updateStock(item.id, Number.parseInt(e.target.value) || 0)}
                      className="w-20"
                      min="0"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Min: {item.minStock}</div>
                      <div>Max: {item.maxStock}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.reorderPoint}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item.status) as any}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>{item.lastRestocked}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={item.status !== "Low Stock" && item.status !== "Out of Stock"}
                    >
                      Reorder
                    </Button>
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
