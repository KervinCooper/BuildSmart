import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InventoryHeader } from "@/components/inventory/inventory-header"
import { InventoryStats } from "@/components/inventory/inventory-stats"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { StockAlerts } from "@/components/inventory/stock-alerts"

export default async function InventoryPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user inventory with material details
  const { data: inventory } = await supabase
    .from("user_inventory")
    .select(
      `
      *,
      materials(
        id,
        name,
        description,
        unit,
        material_categories(name)
      )
    `,
    )
    .eq("user_id", data.user.id)
    .order("last_updated", { ascending: false })

  // Get stock alerts
  const { data: alerts } = await supabase
    .from("stock_alerts")
    .select(
      `
      *,
      user_inventory(
        id,
        current_stock,
        minimum_stock,
        materials(name, unit)
      )
    `,
    )
    .eq("user_id", data.user.id)
    .eq("is_acknowledged", false)
    .order("created_at", { ascending: false })

  // Calculate stats
  const totalItems = inventory?.length || 0
  const lowStockItems = inventory?.filter((item) => item.current_stock <= item.minimum_stock).length || 0
  const outOfStockItems = inventory?.filter((item) => item.current_stock <= 0).length || 0
  const totalValue = inventory?.reduce((sum, item) => sum + item.current_stock * (item.unit_cost || 0), 0) || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <InventoryHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats */}
          <InventoryStats
            totalItems={totalItems}
            lowStockItems={lowStockItems}
            outOfStockItems={outOfStockItems}
            totalValue={totalValue}
          />

          {/* Alerts */}
          {alerts && alerts.length > 0 && <StockAlerts alerts={alerts} />}

          {/* Inventory Table */}
          <InventoryTable inventory={inventory || []} />
        </div>
      </div>
    </div>
  )
}
