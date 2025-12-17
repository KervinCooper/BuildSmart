import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Minus, MoreHorizontal, Package } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface InventoryItem {
  id: string
  current_stock: number
  minimum_stock: number
  maximum_stock?: number
  unit_cost?: number
  location?: string
  notes?: string
  last_updated: string
  materials: {
    id: string
    name: string
    description: string
    unit: string
    material_categories: {
      name: string
    }
  }
}

interface InventoryTableProps {
  inventory: InventoryItem[]
}

export function InventoryTable({ inventory }: InventoryTableProps) {
  const getStockStatus = (current: number, minimum: number) => {
    if (current <= 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (current <= minimum) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  if (inventory.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Package className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items</h3>
          <p className="text-gray-600 mb-4">Start by adding materials to your inventory.</p>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add First Material
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Material</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Current Stock</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Min/Max</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const status = getStockStatus(item.current_stock, item.minimum_stock)
                const value = item.current_stock * (item.unit_cost || 0)

                return (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{item.materials.name}</div>
                        <div className="text-sm text-gray-600">{item.materials.description}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">{item.materials.material_categories.name}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium">
                        {item.current_stock} {item.materials.unit}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        Min: {item.minimum_stock}
                        {item.maximum_stock && (
                          <>
                            <br />
                            Max: {item.maximum_stock}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium">${value.toFixed(2)}</div>
                      {item.unit_cost && (
                        <div className="text-sm text-gray-600">
                          ${item.unit_cost.toFixed(2)}/{item.materials.unit}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">{item.location || "Not specified"}</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>View History</DropdownMenuItem>
                            <DropdownMenuItem>Reorder</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
