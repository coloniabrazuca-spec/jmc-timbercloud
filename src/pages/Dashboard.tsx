import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, Truck, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStock: 0,
    todayProduction: 0,
    todayTrucks: 0,
    monthSales: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Total stock
      const { data: stockData } = await supabase
        .from("wood_stock")
        .select("quantity");
      const totalStock = stockData?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;

      // Today's production
      const today = new Date().toISOString().split("T")[0];
      const { data: productionData } = await supabase
        .from("pallet_production")
        .select("quantity")
        .eq("production_date", today);
      const todayProduction = productionData?.reduce((sum, item) => sum + item.quantity, 0) || 0;

      // Today's trucks
      const { data: trucksData } = await supabase
        .from("trucks")
        .select("*")
        .gte("delivery_date", `${today}T00:00:00`)
        .lte("delivery_date", `${today}T23:59:59`);
      const todayTrucks = trucksData?.length || 0;

      // Month sales
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];
      const { data: salesData } = await supabase
        .from("sales")
        .select("total_amount")
        .gte("sale_date", firstDayOfMonth);
      const monthSales = salesData?.reduce((sum, item) => sum + Number(item.total_amount), 0) || 0;

      setStats({
        totalStock,
        todayProduction,
        todayTrucks,
        monthSales,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="font-display font-bold text-3xl mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral da sua operação</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-soft hover:shadow-medium transition-base">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estoque Total</CardTitle>
                <Package className="text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStock.toFixed(2)} m³</div>
                <p className="text-xs text-muted-foreground">Total em estoque</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-base">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paletes Hoje</CardTitle>
                <BarChart3 className="text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayProduction} un</div>
                <p className="text-xs text-muted-foreground">Produção do dia</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-base">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entregas Hoje</CardTitle>
                <Truck className="text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayTrucks} caminhões</div>
                <p className="text-xs text-muted-foreground">Entregas registradas</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-base">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
                <TrendingUp className="text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {stats.monthSales.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Total de vendas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;
