"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Order {
  _id: string;
  orderNumber: string;
  email: string;
  status: string;
  total: number;
}

export default function AdminDashboard() {
  const orderStats = useQuery(api.orders.getOrderStats);
  const recentOrders = useQuery(api.orders.getRecentOrders, { limit: 5 });
  const products = useQuery(api.products.getAll, { limit: 100 });

  // Calculate stats
  const totalRevenue = orderStats?.totalRevenue ?? 0;
  const totalOrders = orderStats?.totalOrders ?? 0;
  const totalProducts = products?.length ?? 0;
  const totalCustomers = 0; // TODO: Add customers count

  const statCards = [
    {
      name: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      change: 12.5,
      changeType: "increase" as const,
      href: "/admin/analytics",
    },
    {
      name: "Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      change: 8.3,
      changeType: "increase" as const,
      href: "/admin/orders",
    },
    {
      name: "Products",
      value: totalProducts.toString(),
      icon: Package,
      change: null,
      changeType: "neutral" as const,
      href: "/admin/products",
    },
    {
      name: "Customers",
      value: totalCustomers.toString(),
      icon: Users,
      change: 5.2,
      changeType: "increase" as const,
      href: "/admin/customers",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="group rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-brand-soft-pink p-2">
                <stat.icon className="h-5 w-5 text-brand-pink" />
              </div>
              {stat.change !== null && (
                <div
                  className={`flex items-center text-sm font-medium ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.changeType === "increase" ? (
                    <TrendingUp className="mr-1 h-4 w-4" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4" />
                  )}
                  {stat.change}%
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm text-brand-pink hover:underline flex items-center"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          {recentOrders === undefined ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-pink"></div>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p>No recent orders yet.</p>
              <p className="text-sm">
                Orders will appear here once customers start buying.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order: Order) => (
                <Link
                  key={order._id}
                  href={`/admin/orders/${order._id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {order.status}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:border-brand-pink hover:bg-brand-soft-pink/30 transition"
            >
              <Package className="h-5 w-5 text-brand-pink" />
              <span className="text-sm font-medium">Add Product</span>
            </Link>
            <Link
              href="/admin/discounts/new"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:border-brand-pink hover:bg-brand-soft-pink/30 transition"
            >
              <DollarSign className="h-5 w-5 text-brand-pink" />
              <span className="text-sm font-medium">Create Discount</span>
            </Link>
            <Link
              href="/admin/messages"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:border-brand-pink hover:bg-brand-soft-pink/30 transition"
            >
              <Users className="h-5 w-5 text-brand-pink" />
              <span className="text-sm font-medium">View Messages</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:border-brand-pink hover:bg-brand-soft-pink/30 transition"
            >
              <TrendingUp className="h-5 w-5 text-brand-pink" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="mt-8 rounded-xl bg-gradient-to-r from-brand-pink to-brand-blush p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Getting Started</h2>
        <p className="mb-4 opacity-90">
          Complete these steps to launch your store:
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold mb-1">1</div>
            <p className="text-sm">Add your products with images</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold mb-1">2</div>
            <p className="text-sm">Connect Stripe for payments</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold mb-1">3</div>
            <p className="text-sm">Set up Printful/CJ integration</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold mb-1">4</div>
            <p className="text-sm">Launch and start selling!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
