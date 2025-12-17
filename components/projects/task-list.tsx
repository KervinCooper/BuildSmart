import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Calendar, Clock } from "lucide-react"

interface Task {
  id: string
  name: string
  description?: string
  status: string
  priority: string
  start_date?: string
  due_date?: string
  estimated_hours?: number
  actual_hours: number
  completion_percentage: number
}

interface TaskListProps {
  tasks: Task[]
  projectId: string
}

export function TaskList({ tasks, projectId }: TaskListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "blocked":
        return "bg-red-100 text-red-800"
      case "todo":
        return "bg-gray-100 text-gray-800"
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tasks ({tasks.length})</CardTitle>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No tasks created yet</p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Create First Task
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{task.name}</h4>
                    {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{task.completion_percentage}%</span>
                  </div>
                  <Progress value={task.completion_percentage} className="h-2" />
                </div>

                {/* Task Details */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    {task.due_date && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due {new Date(task.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {task.estimated_hours && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {task.actual_hours}h / {task.estimated_hours}h
                        </span>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
