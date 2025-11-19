import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, Truck, TrendingUp } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da sua operação</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-soft hover:shadow-medium transition-base">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Total</CardTitle>
              <Package className="text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.245 m³</div>
              <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-base">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paletes Hoje</CardTitle>
              <BarChart3 className="text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">328 un</div>
              <p className="text-xs text-muted-foreground">Meta diária: 300 un</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-base">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregas Hoje</CardTitle>
              <Truck className="text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8 caminhões</div>
              <p className="text-xs text-muted-foreground">45 m³ recebidos</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-base">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
              <TrendingUp className="text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 142.500</div>
              <p className="text-xs text-muted-foreground">+18% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-muted-foreground">
          <p>Sistema em desenvolvimento. Mais funcionalidades em breve.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
