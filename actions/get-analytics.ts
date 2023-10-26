import prisma from "@/lib/prisma";

export async function getAnalytics() {
  try {
    const orders = await prisma.order.findMany()
    const reports = await prisma.report.findMany()
    const companies = await prisma.company.findMany()

    const totalOrders = orders.length
    const totalReports = reports.length
    const totalCompanies = companies.length

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