import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Truck, Package } from "lucide-react"
import Link from "next/link"

interface Material {
  id: string
  name: string
  description: string
  unit: string
  image_url?: string
  specifications: any
  material_categories: {
    name: string
  }
  supplier_materials: Array<{
    id: string
    price: number
    stock_quantity: number
    minimum_order: number
    delivery_time_days: number
    is_available: boolean
    suppliers: {
      name: string
      rating: number
      is_verified: boolean
    }
  }>
}

interface MaterialGridProps {
  materials: Material[]
}

export function MaterialGrid({ materials }: MaterialGridProps) {
  if (materials.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((material) => {
        // Get the best price from available suppliers
        const availableSuppliers = material.supplier_materials.filter((sm) => sm.is_available)
        const bestPrice = availableSuppliers.length > 0 ? Math.min(...availableSuppliers.map((sm) => sm.price)) : null
        const priceRange =
          availableSuppliers.length > 1
            ? `$${Math.min(...availableSuppliers.map((sm) => sm.price)).toFixed(2)} - $${Math.max(...availableSuppliers.map((sm) => sm.price)).toFixed(2)}`
            : bestPrice
              ? `$${bestPrice.toFixed(2)}`
              : "Price on request"

        return (
          <Card key={material.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{material.name}</CardTitle>
                  <CardDescription className="mt-1">{material.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {material.material_categories.name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pricing */}
                <div>
                  <div className="text-2xl font-bold text-emerald-600">{priceRange}</div>
                  <div className="text-sm text-gray-600">per {material.unit}</div>
                </div>

                {/* Supplier Info */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>
                      {availableSuppliers.length > 0
                        ? (
                            availableSuppliers.reduce((sum, sm) => sum + sm.suppliers.rating, 0) /
                            availableSuppliers.length
                          ).toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Truck className="h-4 w-4" />
                    <span>
                      {availableSuppliers.length > 0
                        ? `${Math.min(...availableSuppliers.map((sm) => sm.delivery_time_days))}-${Math.max(...availableSuppliers.map((sm) => sm.delivery_time_days))} days`
                        : "Contact supplier"}
                    </span>
                  </div>
                </div>

                {/* Suppliers count */}
                <div className="text-sm text-gray-600">
                  {availableSuppliers.length} supplier{availableSuppliers.length !== 1 ? "s" : ""} available
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <Link href={`/marketplace/materials/${material.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Compare Prices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
