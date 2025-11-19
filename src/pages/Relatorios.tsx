import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Relatorios = () => {
  const { toast } = useToast();

  const generateReport = async (type: string) => {
    try {
      let data: any[] = [];
      let filename = "";
      let headers: string[] = [];

      switch (type) {
        case "estoque":
          const { data: stockData } = await supabase
            .from("wood_stock")
            .select("*, suppliers(name)")
            .order("entry_date", { ascending: false });
          data = stockData || [];
          filename = "relatorio_estoque.csv";
          headers = ["Tipo", "Quantidade", "Fornecedor", "Data de Entrada"];
          break;

        case "caminhoes":
          const { data: trucksData } = await supabase
            .from("trucks")
            .select("*, suppliers(name)")
            .order("delivery_date", { ascending: false });
          data = trucksData || [];
          filename = "relatorio_caminhoes.csv";
          headers = ["Placa", "Motorista", "Fornecedor", "Tipo Madeira", "Quantidade", "Data"];
          break;

        case "producao":
          const { data: productionData } = await supabase
            .from("pallet_production")
            .select("*")
            .order("production_date", { ascending: false });
          data = productionData || [];
          filename = "relatorio_producao.csv";
          headers = ["Data", "Quantidade", "Tamanho", "Madeira Consumida", "Operador"];
          break;

        case "vendas":
          const { data: salesData } = await supabase
            .from("sales")
            .select("*")
            .order("sale_date", { ascending: false });
          data = salesData || [];
          filename = "relatorio_vendas.csv";
          headers = ["Data", "Comprador", "Produto", "Quantidade", "Valor Total", "Status"];
          break;
      }

      if (data.length === 0) {
        toast({
          title: "Sem dados",
          description: "Não há dados para gerar o relatório",
          variant: "destructive",
        });
        return;
      }

      // Generate CSV
      let csv = headers.join(";") + "\n";

      data.forEach((item: any) => {
        let row: string[] = [];
        
        switch (type) {
          case "estoque":
            row = [
              item.wood_type,
              item.quantity,
              item.suppliers?.name || "-",
              new Date(item.entry_date).toLocaleDateString("pt-BR"),
            ];
            break;
          case "caminhoes":
            row = [
              item.license_plate,
              item.driver_name,
              item.suppliers?.name || "-",
              item.wood_type,
              item.quantity,
              new Date(item.delivery_date).toLocaleString("pt-BR"),
            ];
            break;
          case "producao":
            row = [
              new Date(item.production_date).toLocaleDateString("pt-BR"),
              item.quantity,
              item.pallet_size,
              item.wood_consumed,
              item.operator_name || "-",
            ];
            break;
          case "vendas":
            row = [
              new Date(item.sale_date).toLocaleDateString("pt-BR"),
              item.buyer_name,
              item.product_type,
              item.quantity,
              `R$ ${parseFloat(item.total_amount).toFixed(2)}`,
              item.payment_status === "paid" ? "Pago" : "Pendente",
            ];
            break;
        }

        csv += row.join(";") + "\n";
      });

      // Download CSV
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      toast({
        title: "Relatório gerado!",
        description: `O arquivo ${filename} foi baixado com sucesso`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao gerar relatório",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const reports = [
    {
      title: "Relatório de Estoque",
      description: "Exportar todos os dados do estoque de madeira",
      type: "estoque",
    },
    {
      title: "Relatório de Caminhões",
      description: "Exportar histórico de entregas de caminhões",
      type: "caminhoes",
    },
    {
      title: "Relatório de Produção",
      description: "Exportar dados de produção de paletes",
      type: "producao",
    },
    {
      title: "Relatório de Vendas",
      description: "Exportar histórico completo de vendas",
      type: "vendas",
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="font-display font-bold text-3xl mb-2">Relatórios</h1>
            <p className="text-muted-foreground">
              Gere e exporte relatórios em formato CSV
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => (
              <Card key={report.type} className="shadow-soft hover:shadow-medium transition-base">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <FileText className="text-primary h-6 w-6" />
                    <div>
                      <CardTitle>{report.title}</CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => generateReport(report.type)}
                    className="w-full gradient-forest"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Exportar CSV
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Relatorios;
