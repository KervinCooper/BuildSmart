import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, DollarSign, Clock, CheckCircle } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  start_date?: string
  end_date?: string
  estimated_budget?: number
  actual_cost: number
}

interface Task {
  id: string
  status: string
  estimated_hours?: number
  actual_hours: number
}

interface ProjectOverviewProps {
  project: Project
  tasks: Task[]
}

export function ProjectOverview({ project, tasks }: ProjectOverviewProps) {
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  const totalEstimatedHours = tasks.reduce((sum, task) => sum + (task.estimated_hours || 0), 0)
  const totalActualHours = tasks.reduce((sum, task) => sum + task.actual_hours, 0)

  const daysUntilDue = project.end_date
    ? Math.ceil((new Date(project.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Progress */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">Progress</span>
              </div>
              <div className="text-2xl font-bold mb-2">{progress}%</div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-600 mt-1">
                {completedTasks} of {tasks.length} tasks completed
              </p>
            </div>

            {/* Timeline */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Timeline</span>
              </div>
              <div className="text-2xl font-bold mb-2">
                {daysUntilDue !== null ? (daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}d` : `${daysUntilDue}d`) : "N/A"}
              </div>
              <p className="text-xs text-gray-600">
                {daysUntilDue !== null
                  ? daysUntilDue < 0
                    ? "overdue"
                    : daysUntilDue === 0
                      ? "due today"
                      : "remaining"
                  : "No due date"}
              </p>
            </div>

            {/* Budget */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Budget</span>
              </div>
              <div className="text-2xl font-bold mb-2">${project.estimated_budget?.toLocaleString() || "0"}</div>
              <p className="text-xs text-gray-600">
                ${project.actual_cost.toLocaleString()} spent (
                {project.estimated_budget ? Math.round((project.actual_cost / project.estimated_budget) * 100) : 0}
                %)
              </p>
            </div>

            {/* Hours */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Hours</span>
              </div>
              <div className="text-2xl font-bold mb-2">{totalActualHours}h</div>
              <p className="text-xs text-gray-600">
                of {totalEstimatedHours}h estimated (
                {totalEstimatedHours > 0 ? Math.round((totalActualHours / totalEstimatedHours) * 100) : 0}%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
