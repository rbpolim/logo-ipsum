import prisma from "@/lib/prisma";

export async function getAnalytics() {
  try {
    const totalOrders = await prisma.order.count()
    const totalReports = await prisma.report.count()
    const totalCompanies = await prisma.company.count()

    return {
      totalOrders,
      totalReports,
      totalCompanies
    }
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      totalOrders: 0,
      totalReports: 0,
      totalCompanies: 0
    } 
  }
}