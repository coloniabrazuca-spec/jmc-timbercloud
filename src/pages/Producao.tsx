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

const Producao = () => {
  const [production, setProduction] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    quantity: "",
    pallet_size: "120x100",
    wood_consumed: "",
    operator_name: "",
    production_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    fetchProduction();
  }, []);

  const fetchProduction = async () => {
    try {
      const { data, error } = await supabase
        .from("pallet_production")
        .select("*")
        .order("production_date", { ascending: false });

      if (error) throw error;
      setProduction(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar produção",
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
      
      if (editingItem) {
        const { error } = await supabase
          .from("pallet_production")
          .update({
            ...formData,
            quantity: parseInt(formData.quantity),
            wood_consumed: parseFloat(formData.wood_consumed),
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        toast({ title: "Produção atualizada com sucesso!" });
      } else {
        const { error } = await supabase.from("pallet_production").insert([
          {
            ...formData,
            quantity: parseInt(formData.quantity),
            wood_consumed: parseFloat(formData.wood_consumed),
            created_by: user?.id,
          },
        ]);

        if (error) throw error;
        toast({ title: "Produção registrada com sucesso!" });
      }

      setDialogOpen(false);
      resetForm();
      fetchProduction();
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
      quantity: item.quantity.toString(),
      pallet_size: item.pallet_size,
      wood_consumed: item.wood_consumed.toString(),
      operator_name: item.operator_name || "",
      production_date: item.production_date,
      notes: item.notes || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;

    try {
      const { error } = await supabase.from("pallet_production").delete().eq("id", id);
      if (error) throw error;

      toast({ title: "Registro removido com sucesso!" });
      fetchProduction();
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
      quantity: "",
      pallet_size: "120x100",
      wood_consumed: "",
      operator_name: "",
      production_date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setEditingItem(null);
  };

  const totalProduction = production.reduce((sum, item) => sum + item.quantity, 0);
  const totalWoodConsumed = production.reduce((sum, item) => sum + parseFloat(item.wood_consumed), 0);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-display font-bold text-3xl">Produção de Paletes</h1>
              <p className="text-muted-foreground">
                Total: {totalProduction} un | Madeira: {totalWoodConsumed.toFixed(2)} m³
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-forest" onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Produção
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Editar Produção" : "Registrar Produção"}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os dados da produção de paletes
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="quantity">Quantidade (unidades) *</Label>
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
                    <Label htmlFor="pallet_size">Tamanho do Palete *</Label>
                    <select
                      id="pallet_size"
                      value={formData.pallet_size}
                      onChange={(e) =>
                        setFormData({ ...formData, pallet_size: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="120x100">120x100 cm</option>
                      <option value="120x80">120x80 cm</option>
                      <option value="100x100">100x100 cm</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="wood_consumed">Madeira Consumida (m³) *</Label>
                    <Input
                      id="wood_consumed"
                      type="number"
                      step="0.01"
                      value={formData.wood_consumed}
                      onChange={(e) =>
                        setFormData({ ...formData, wood_consumed: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="operator_name">Operador</Label>
                    <Input
                      id="operator_name"
                      value={formData.operator_name}
                      onChange={(e) =>
                        setFormData({ ...formData, operator_name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="production_date">Data *</Label>
                    <Input
                      id="production_date"
                      type="date"
                      value={formData.production_date}
                      onChange={(e) =>
                        setFormData({ ...formData, production_date: e.target.value })
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
                    {editingItem ? "Atualizar" : "Registrar"}
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
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Madeira</TableHead>
                  <TableHead>Operador</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : production.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Nenhuma produção registrada
                    </TableCell>
                  </TableRow>
                ) : (
                  production.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {new Date(item.production_date).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="font-medium">{item.quantity} un</TableCell>
                      <TableCell>{item.pallet_size}</TableCell>
                      <TableCell>{item.wood_consumed} m³</TableCell>
                      <TableCell>{item.operator_name || "-"}</TableCell>
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

export default Producao;
