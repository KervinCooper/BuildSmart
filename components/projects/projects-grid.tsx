import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, MapPin, User, DollarSign, FolderOpen } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  name: string
  description: string
  status: string
  priority: string
  start_date?: string
  end_date?: string
  estimated_budget?: number
  actual_cost: number
  client_name?: string
  location?: string
  project_tasks: Array<{ id: string; status: string }>
  project_materials: Array<{ id: string; actual_cost: number }>
}

interface ProjectsGridProps {
  projects: Project[]
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "planning":
        return "bg-blue-100 text-blue-800"
      case "on_hold":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateProgress = (tasks: Array<{ status: string }>) => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter((task) => task.status === "completed").length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FolderOpen className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-4">Create your first construction project to get started.</p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/projects/new">Create First Project</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const progress = calculateProgress(project.project_tasks)
        const daysUntilDue = project.end_date
          ? Math.ceil((new Date(project.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : null

        return (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="mt-1">{project.description}</CardDescription>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <Badge className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
                  <Badge variant="outline" className={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Project Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  {project.client_name && (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{project.client_name}</span>
                    </div>
                  )}
                  {project.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{project.location}</span>
                    </div>
                  )}
                  {project.estimated_budget && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>${project.estimated_budget.toLocaleString()} budget</span>
                    </div>
                  )}
                  {daysUntilDue !== null && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span
                        className={
                          daysUntilDue < 0 ? "text-red-600" : daysUntilDue <= 7 ? "text-amber-600" : "text-gray-600"
                        }
                      >
                        {daysUntilDue < 0
                          ? `${Math.abs(daysUntilDue)} days overdue`
                          : daysUntilDue === 0
                            ? "Due today"
                            : `${daysUntilDue} days remaining`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Task Summary */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{project.project_tasks.length} tasks</span>
                  <span>{project.project_tasks.filter((t) => t.status === "completed").length} completed</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button asChild className="flex-1">
                    <Link href={`/projects/${project.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Edit
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
