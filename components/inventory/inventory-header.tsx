"use client"

import { Button } from "@/components/ui/button"
import { Package, Plus, Download, Settings } from "lucide-react"
import Link from "next/link"

export function InventoryHeader() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">BuildSmart</span>
            </Link>
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold text-gray-900">Inventory Tracker</h1>
              <p className="text-sm text-gray-600">Manage your construction materials</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Material
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
