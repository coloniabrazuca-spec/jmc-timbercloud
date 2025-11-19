import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const Vendas = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    buyer_name: "",
    buyer_contact: "",
    product_type: "",
    quantity: "",
    unit_price: "",
    payment_method: "dinheiro",
    payment_status: "pending",
    sale_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .order("sale_date", { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar vendas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const totalAmount = parseFloat(formData.quantity) * parseFloat(formData.unit_price);
      
      if (editingItem) {
        const { error } = await supabase
          .from("sales")
          .update({
            ...formData,
            quantity: parseInt(formData.quantity),
            unit_price: parseFloat(formData.unit_price),
            total_amount: totalAmount,
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        toast({ title: "Venda atualizada com sucesso!" });
      } else {
        const { error } = await supabase.from("sales").insert([
          {
            ...formData,
            quantity: parseInt(formData.quantity),
            unit_price: parseFloat(formData.unit_price),
            total_amount: totalAmount,
            created_by: user?.id,
          },
        ]);

        if (error) throw error;
        toast({ title: "Venda registrada com sucesso!" });
      }

      setDialogOpen(false);
      resetForm();
      fetchSales();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      buyer_name: item.buyer_name,
      buyer_contact: item.buyer_contact || "",
      product_type: item.product_type,
      quantity: item.quantity.toString(),
      unit_price: item.unit_price.toString(),
      payment_method: item.payment_method || "dinheiro",
      payment_status: item.payment_status,
      sale_date: item.sale_date,
      notes: item.notes || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta venda?")) return;

    try {
      const { error } = await supabase.from("sales").delete().eq("id", id);
      if (error) throw error;

      toast({ title: "Venda removida com sucesso!" });
      fetchSales();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      buyer_name: "",
      buyer_contact: "",
      product_type: "",
      quantity: "",
      unit_price: "",
      payment_method: "dinheiro",
      payment_status: "pending",
      sale_date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setEditingItem(null);
  };

  const totalSales = sales.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-display font-bold text-3xl">Vendas</h1>
              <p className="text-muted-foreground">
                Total: R$ {totalSales.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-forest" onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Venda
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Editar Venda" : "Nova Venda"}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os dados da venda
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="buyer_name">Nome do Comprador *</Label>
                    <Input
                      id="buyer_name"
                      value={formData.buyer_name}
                      onChange={(e) =>
                        setFormData({ ...formData, buyer_name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="buyer_contact">Contato</Label>
                    <Input
                      id="buyer_contact"
                      value={formData.buyer_contact}
                      onChange={(e) =>
                        setFormData({ ...formData, buyer_contact: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="product_type">Tipo de Produto *</Label>
                    <Input
                      id="product_type"
                      value={formData.product_type}
                      onChange={(e) =>
                        setFormData({ ...formData, product_type: e.target.value })
                      }
                      placeholder="Ex: Palete 120x100"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantidade *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit_price">Preço Unitário (R$) *</Label>
                    <Input
                      id="unit_price"
                      type="number"
                      step="0.01"
                      value={formData.unit_price}
                      onChange={(e) =>
                        setFormData({ ...formData, unit_price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment_method">Forma de Pagamento</Label>
                    <select
                      id="payment_method"
                      value={formData.payment_method}
                      onChange={(e) =>
                        setFormData({ ...formData, payment_method: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="dinheiro">Dinheiro</option>
                      <option value="pix">PIX</option>
                      <option value="boleto">Boleto</option>
                      <option value="cartao">Cartão</option>
                      <option value="transferencia">Transferência</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="payment_status">Status do Pagamento *</Label>
                    <select
                      id="payment_status"
                      value={formData.payment_status}
                      onChange={(e) =>
                        setFormData({ ...formData, payment_status: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="pending">Pendente</option>
                      <option value="paid">Pago</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="sale_date">Data da Venda *</Label>
                    <Input
                      id="sale_date"
                      type="date"
                      value={formData.sale_date}
                      onChange={(e) =>
                        setFormData({ ...formData, sale_date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                    />
                  </div>
                  <Button type="submit" className="w-full gradient-forest">
                    {editingItem ? "Atualizar" : "Registrar Venda"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-card rounded-lg shadow-soft overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Comprador</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : sales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Nenhuma venda registrada
                    </TableCell>
                  </TableRow>
                ) : (
                  sales.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {new Date(item.sale_date).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="font-medium">{item.buyer_name}</TableCell>
                      <TableCell>{item.product_type}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        R$ {parseFloat(item.total_amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.payment_status === "paid" ? "default" : "secondary"}>
                          {item.payment_status === "paid" ? "Pago" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Vendas;
