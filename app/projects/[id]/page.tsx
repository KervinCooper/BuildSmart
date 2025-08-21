import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectOverview } from "@/components/projects/project-overview"
import { TaskList } from "@/components/projects/task-list"
import { ProjectMaterials } from "@/components/projects/project-materials"
import { ProjectTimeline } from "@/components/projects/project-timeline"

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get project details
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", data.user.id)
    .single()

  if (!project) {
    notFound()
  }

  // Get project tasks
  const { data: tasks } = await supabase
    .from("project_tasks")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: true })

  // Get project materials
  const { data: materials } = await supabase
    .from("project_materials")
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
    .eq("project_id", id)

  // Get project milestones
  const { data: milestones } = await supabase
    .from("project_milestones")
    .select("*")
    .eq("project_id", id)
    .order("due_date", { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectHeader project={project} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ProjectOverview project={project} tasks={tasks || []} />
            <TaskList tasks={tasks || []} projectId={id} />
            <ProjectMaterials materials={materials || []} projectId={id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <ProjectTimeline milestones={milestones || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
