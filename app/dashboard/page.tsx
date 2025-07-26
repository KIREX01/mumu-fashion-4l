import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, TrendingUp, Users, AlertTriangle, DollarSign } from "lucide-react"

async function getDashboardStats() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/dashboard/stats`, {
      cache: "no-store",
    })
    if (!response.ok) throw new Error("Failed to fetch stats")
    return await response.json()
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      productCount: 0,
      orderCount: 0,
      customerCount: 0,
      revenue: 0,
      lowStockItems: [],
      recentOrders: [],
    }
  }
}

export default async function Dashboard() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      title: "Total Products",
      value: stats.productCount.toString(),
      change: "+12%",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: stats.orderCount.toString(),
      change: "+8%",
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      change: "+23%",
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Customers",
      value: stats.customerCount.toString(),
      change: "+15%",
      icon: Users,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Mumu Fashion Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>Items that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.lowStockItems.length > 0 ? (
                stats.lowStockItems.map((item: any) => (
                  <div key={item.sku} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                    </div>
                    <Badge variant={item.stock <= 2 ? "destructive" : "secondary"}>{item.stock} left</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">All items are well stocked</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Recent Orders
            </CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order: any) => (
                  <div key={order.order_number} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${Number.parseFloat(order.total).toFixed(2)}</p>
                      <Badge
                        variant={
                          order.status === "Delivered"
                            ? "default"
                            : order.status === "Shipped"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
