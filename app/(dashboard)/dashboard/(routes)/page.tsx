import { DashboardClient } from "../_components/client"

const DashboardPage = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 p-4 md:p-8 pt-6 space-y-4">
        <DashboardClient />
      </div>
    </div>
  )
}

export default DashboardPage