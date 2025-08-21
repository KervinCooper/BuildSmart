import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Package } from "lucide-react"

interface Material {
  id: string
  quantity_needed: number
  quantity_allocated: number
  quantity_used: number
  estimated_cost?: number
  actual_cost: number
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

interface ProjectMaterialsProps {
  materials: Material[]
  projectId: string
}

export function ProjectMaterials({ materials, projectId }: ProjectMaterialsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Materials ({materials.length})</CardTitle>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Material
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {materials.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Package className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-gray-600 mb-4">No materials assigned yet</p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Assign Materials
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {materials.map((material) => {
              const allocationProgress = (material.quantity_allocated / material.quantity_needed) * 100
              const usageProgress = (material.quantity_used / material.quantity_needed) * 100

              return (
                <div key={material.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{material.materials.name}</h4>
                      <p className="text-sm text-gray-600">{material.materials.description}</p>
                    </div>
                    <Badge variant="outline">{material.materials.material_categories.name}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    {/* Needed */}
                    <div>
                      <p className="text-sm text-gray-600">Needed</p>
                      <p className="font-medium">
                        {material.quantity_needed} {material.materials.unit}
                      </p>
                    </div>

                    {/* Allocated */}
                    <div>
                      <p className="text-sm text-gray-600">Allocated</p>
                      <p className="font-medium">
                        {material.quantity_allocated} {material.materials.unit}
                      </p>
                      <Progress value={allocationProgress} className="h-1 mt-1" />
                    </div>

                    {/* Used */}
                    <div>
                      <p className="text-sm text-gray-600">Used</p>
                      <p className="font-medium">
                        {material.quantity_used} {material.materials.unit}
                      </p>
                      <Progress value={usageProgress} className="h-1 mt-1" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                      Cost: ${material.actual_cost.toFixed(2)}
                      {material.estimated_cost && (
                        <span className="ml-2">(Est: ${material.estimated_cost.toFixed(2)})</span>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      Update
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
