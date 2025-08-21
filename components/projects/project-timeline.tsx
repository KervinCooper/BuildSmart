import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Clock } from "lucide-react"

interface Milestone {
  id: string
  name: string
  description?: string
  due_date: string
  completed_date?: string
  status: string
}

interface ProjectTimelineProps {
  milestones: Milestone[]
}

export function ProjectTimeline({ milestones }: ProjectTimelineProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "overdue":
        return <Clock className="h-4 w-4 text-red-600" />
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline & Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        {milestones.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No milestones set</p>
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative">
                {/* Timeline line */}
                {index < milestones.length - 1 && <div className="absolute left-5 top-8 w-0.5 h-8 bg-gray-200"></div>}

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">{getStatusIcon(milestone.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{milestone.name}</h4>
                      <Badge className={getStatusColor(milestone.status)}>{milestone.status}</Badge>
                    </div>
                    {milestone.description && <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>}
                    <div className="text-sm text-gray-600">
                      <p>Due: {new Date(milestone.due_date).toLocaleDateString()}</p>
                      {milestone.completed_date && (
                        <p>Completed: {new Date(milestone.completed_date).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
