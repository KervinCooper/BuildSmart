import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MarketplaceHeader } from "@/components/marketplace/marketplace-header"
import { MaterialGrid } from "@/components/marketplace/material-grid"
import { CategoryFilter } from "@/components/marketplace/category-filter"

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get categories
  const { data: categories } = await supabase.from("material_categories").select("*").order("name")

  // Get materials with supplier pricing
  let query = supabase
    .from("materials")
    .select(
      `
      *,
      material_categories(name),
      supplier_materials(
        id,
        price,
        stock_quantity,
        minimum_order,
        delivery_time_days,
        is_available,
        suppliers(name, rating, is_verified)
      )
    `,
    )
    .order("name")

  // Apply filters
  if (params.category) {
    query = query.eq("material_categories.name", params.category)
  }

  if (params.search) {
    query = query.ilike("name", `%${params.search}%`)
  }

  const { data: materials } = await query

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketplaceHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <CategoryFilter categories={categories || []} selectedCategory={params.category} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Material Marketplace</h1>
              <p className="text-gray-600">
                {params.search
                  ? `Search results for "${params.search}"`
                  : params.category
                    ? `Materials in ${params.category}`
                    : "Browse all construction materials"}
              </p>
            </div>

            <MaterialGrid materials={materials || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
