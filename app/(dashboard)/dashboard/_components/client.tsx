import { getAnalytics } from "@/actions/get-analytics";

import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";

import { DataCard } from "../_components/data-card";

export async function DashboardClient() {
  const { totalOrders, totalReports, totalCompanies } = await getAnalytics()

  return (
    <>
      <Heading
        title='Dashboard'
        description="You can view your numbers here"
      />
      <Separator />
      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
        <DataCard
          label="Total Orders"
          value={totalOrders}
        />
        <DataCard
          label="Total Reports"
          value={totalReports}
        />
        <DataCard
          label="Total Companies"
          value={totalCompanies}
        />
      </div>
      {/* <Chart data={data} /> */}
    </>
  )
}