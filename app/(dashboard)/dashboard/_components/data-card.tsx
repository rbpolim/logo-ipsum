import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type DataCardProps = {
  label: string
  value: string | number
}

export function DataCard({
  label,
  value
}: DataCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
        </div>
      </CardContent>
    </Card>
  )
}