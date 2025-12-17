"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  description: string
  icon: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory?: string
}

export function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  const searchParams = useSearchParams()

  const createCategoryUrl = (categoryName?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryName) {
      params.set("category", categoryName)
    } else {
      params.delete("category")
    }
    return `/marketplace?${params.toString()}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          asChild
          variant={!selectedCategory ? "default" : "ghost"}
          className={cn("w-full justify-start", !selectedCategory && "bg-emerald-600 hover:bg-emerald-700")}
        >
          <Link href={createCategoryUrl()}>All Materials</Link>
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            asChild
            variant={selectedCategory === category.name ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              selectedCategory === category.name && "bg-emerald-600 hover:bg-emerald-700",
            )}
          >
            <Link href={createCategoryUrl(category.name)}>{category.name}</Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
