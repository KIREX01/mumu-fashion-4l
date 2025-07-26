"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Package, Truck, CheckCircle, Clock } from "lucide-react"

interface Order {
  id: string
  customerName: string
  customerEmail: string
  orderDate: string
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
  total: number
  items: Array<{
    productName: string
    sku: string
    quantity: number
    price: number
    size: string
    color: string
  }>
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  trackingNumber?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD001",
      customerName: "Alice Johnson",
      customerEmail: "alice@example.com",
      orderDate: "2024-01-20",
      status: "Processing",
      total: 89.99,
      items: [
        {
          productName: "Summer Floral Dress",
          sku: "SF001",
          quantity: 1,
          price: 89.99,
          size: "M",
          color: "Blue",
        },
      ],
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
    },
    {
      id: "ORD002",
      customerName: "Bob Smith",
      customerEmail: "bob@example.com",
      orderDate: "2024-01-19",
      status: "Shipped",
      total: 156.5,
      items: [
        {
          productName: "Classic Denim Jacket",
          sku: "DJ002",
          quantity: 1,
          price: 79.99,
          size: "L",
          color: "Blue",
        },
        {
          productName: "Cotton Basic T-Shirt",
          sku: "CT003",
          quantity: 2,
          price: 24.99,
          size: "L",
          color: "White",
        },
      ],
      shippingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA",
      },
      trackingNumber: "1Z999AA1234567890",
    },
    {
      id: "ORD003",
      customerName: "Carol Davis",
      customerEmail: "carol@example.com",
      orderDate: "2024-01-18",
      status: "Delivered",
      total: 234.0,
      items: [
        {
          productName: "Leather Ankle Boots",
          sku: "LB004",
          quantity: 1,
          price: 149.99,
          size: "8",
          color: "Brown",
        },
        {
          productName: "Summer Floral Dress",
          sku: "SF001",
          quantity: 1,
          price: 89.99,
          size: "S",
          color: "Pink",
        },
      ],
      shippingAddress: {
        street: "789 Pine St",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA",
      },
      trackingNumber: "1Z999AA1234567891",
    },
  ])

  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filteredOrders = orders.filter((order) => statusFilter === "all" || order.status === statusFilter)

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              trackingNumber: newStatus === "Shipped" ? `1Z999AA${Date.now()}` : order.trackingNumber,
            }
          : order,
      ),
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Processing":
        return <Package className="h-4 w-4" />
      case "Shipped":
        return <Truck className="h-4 w-4" />
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "secondary"
      case "Processing":
        return "outline"
      case "Shipped":
        return "default"
      case "Delivered":
        return "default"
      case "Cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "Pending").length
  const processingOrders = orders.filter((o) => o.status === "Processing").length
  const shippedOrders = orders.filter((o) => o.status === "Shipped").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-muted-foreground">Track and manage customer orders</p>
      </div>

      {/* Order Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{processingOrders}</div>
            <p className="text-xs text-muted-foreground">Being prepared</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            <Truck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{shippedOrders}</div>
            <p className="text-xs text-muted-foreground">In transit</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            <div className="flex gap-4 items-center">
              <span>{filteredOrders.length} orders found</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.items.length} item(s)</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.id}</DialogTitle>
                          <DialogDescription>Complete order information and items</DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold">Customer Information</h4>
                                <p>{selectedOrder.customerName}</p>
                                <p className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Order Status</h4>
                                <Badge variant={getStatusColor(selectedOrder.status) as any}>
                                  {getStatusIcon(selectedOrder.status)}
                                  <span className="ml-1">{selectedOrder.status}</span>
                                </Badge>
                                {selectedOrder.trackingNumber && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Tracking: {selectedOrder.trackingNumber}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Shipping Address</h4>
                              <div className="text-sm">
                                <p>{selectedOrder.shippingAddress.street}</p>
                                <p>
                                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                                  {selectedOrder.shippingAddress.zipCode}
                                </p>
                                <p>{selectedOrder.shippingAddress.country}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Order Items</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Size/Color</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Price</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedOrder.items.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{item.productName}</TableCell>
                                      <TableCell className="font-mono">{item.sku}</TableCell>
                                      <TableCell>
                                        {item.size} / {item.color}
                                      </TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>${item.price.toFixed(2)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              <div className="text-right mt-4">
                                <p className="text-lg font-semibold">Total: ${selectedOrder.total.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
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
