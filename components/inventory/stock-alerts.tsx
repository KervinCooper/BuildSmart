import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, XCircle, X } from "lucide-react"

interface Alert {
  id: string
  alert_type: string
  created_at: string
  user_inventory: {
    id: string
    current_stock: number
    minimum_stock: number
    materials: {
      name: string
      unit: string
    }
  }
}

interface StockAlertsProps {
  alerts: Alert[]
}

export function StockAlerts({ alerts }: StockAlertsProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "out_of_stock":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "low_stock":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "out_of_stock":
        return "destructive"
      case "low_stock":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getAlertMessage = (alert: Alert) => {
    const material = alert.user_inventory.materials
    switch (alert.alert_type) {
      case "out_of_stock":
        return `${material.name} is out of stock`
      case "low_stock":
        return `${material.name} is running low (${alert.user_inventory.current_stock} ${material.unit} remaining)`
      default:
        return `${material.name} needs attention`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <span>Stock Alerts</span>
          <Badge variant="secondary">{alerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getAlertIcon(alert.alert_type)}
                <div>
                  <p className="font-medium text-gray-900">{getAlertMessage(alert)}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(alert.created_at).toLocaleDateString()} at{" "}
                    {new Date(alert.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getAlertVariant(alert.alert_type)}>
                  {alert.alert_type.replace("_", " ").toUpperCase()}
                </Badge>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
