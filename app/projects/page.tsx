import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProjectsHeader } from "@/components/projects/projects-header"
import { ProjectsStats } from "@/components/projects/projects-stats"
import { ProjectsGrid } from "@/components/projects/projects-grid"

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user projects with task counts
  const { data: projects } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_tasks(id, status),
      project_materials(id, actual_cost)
    `,
    )
    .eq("user_id", data.user.id)
    .order("updated_at", { ascending: false })

  // Calculate stats
  const totalProjects = projects?.length || 0
  const activeProjects = projects?.filter((p) => p.status === "active").length || 0
  const completedProjects = projects?.filter((p) => p.status === "completed").length || 0
  const totalBudget = projects?.reduce((sum, p) => sum + (p.estimated_budget || 0), 0) || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectsHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats */}
          <ProjectsStats
            totalProjects={totalProjects}
            activeProjects={activeProjects}
            completedProjects={completedProjects}
            totalBudget={totalBudget}
          />

          {/* Projects Grid */}
          <ProjectsGrid projects={projects || []} />
        </div>
      </div>
    </div>
  )
}
