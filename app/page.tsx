import AppAreaChart from "@/components/ui/AppAreaChart";
import AppBarChart from "@/components/ui/AppBarChart";
import AppPieChart from "@/components/ui/AppPieChart";
import AppDataTable from "@/components/ui/AppDataTable";
import AppRadar from "@/components/ui/AppRadar";
import AppRedial from "@/components/ui/AppRedial";
import { getDashboardStats } from "@/lib/db";
import { DollarSign, ShoppingBag, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Force dynamic to ensure real-time data on every request
export const dynamic = "force-dynamic";

const HomePage = async () => {
  const stats = await getDashboardStats();

  const cards = [
    {
      title: "Total Revenue",
      value: `${stats.totalRevenue.toFixed(3)} KWD`,
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-blue-500",
    },
    {
      title: "Delivered",
      value: stats.completedOrders,
      icon: CheckCircle,
      color: "text-emerald-500",
    },
    {
      title: "Pending / Paid",
      value: stats.confirmedOrders,
      icon: Users, 
      color: "text-orange-500",
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Dynamic Stats Cards */}
      {/* <div className="grid grid-cols-2  lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card key={index} className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div> */}

      {/* Existing Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2 shadow-sm">
          <AppBarChart />
        </div>
        <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
          <AppRadar />
        </div>
        <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
          <AppPieChart />
        </div>
        <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
          <AppDataTable />
        </div>
        <div className="bg-card border border-border p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2 shadow-sm">
          <AppAreaChart />
        </div>
        <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
          <AppRedial />
        </div>
      </div>
    </div>
  );
};

export default HomePage;