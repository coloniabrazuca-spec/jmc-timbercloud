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

const Estoque = () => {
  const [stock, setStock] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    wood_type: "",
    quantity: "",
    supplier_id: "",
    entry_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    fetchStock();
    fetchSuppliers();
  }, []);

  const fetchStock = async () => {
    try {
      const { data, error } = await supabase
        .from("wood_stock")
        .select("*, suppliers(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStock(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar estoque",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("name");

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar fornecedores",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (editingItem) {
        const { error } = await supabase
          .from("wood_stock")
          .update({
            ...formData,
            quantity: parseFloat(formData.quantity),
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        toast({ title: "Estoque atualizado com sucesso!" });
      } else {
        const { error } = await supabase.from("wood_stock").insert([
          {
            ...formData,
            quantity: parseFloat(formData.quantity),
            created_by: user?.id,
          },
        ]);

        if (error) throw error;
        toast({ title: "Item adicionado ao estoque!" });
      }

      setDialogOpen(false);
      resetForm();
      fetchStock();
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
      wood_type: item.wood_type,
      quantity: item.quantity.toString(),
      supplier_id: item.supplier_id || "",
      entry_date: item.entry_date,
      notes: item.notes || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      const { error } = await supabase.from("wood_stock").delete().eq("id", id);
      if (error) throw error;

      toast({ title: "Item removido com sucesso!" });
      fetchStock();
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
      wood_type: "",
      quantity: "",
      supplier_id: "",
      entry_date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setEditingItem(null);
  };

  const totalStock = stock.reduce((sum, item) => sum + parseFloat(item.quantity), 0);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-display font-bold text-3xl">Estoque de Madeira</h1>
              <p className="text-muted-foreground">Total: {totalStock.toFixed(2)} m³</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-forest" onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Madeira
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Editar Item" : "Adicionar Madeira"}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os dados do estoque de madeira
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="wood_type">Tipo de Madeira *</Label>
                    <Input
                      id="wood_type"
                      value={formData.wood_type}
                      onChange={(e) =>
                        setFormData({ ...formData, wood_type: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantidade (m³) *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplier_id">Fornecedor</Label>
                    <select
                      id="supplier_id"
                      value={formData.supplier_id}
                      onChange={(e) =>
                        setFormData({ ...formData, supplier_id: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">Selecione um fornecedor</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="entry_date">Data de Entrada *</Label>
                    <Input
                      id="entry_date"
                      type="date"
                      value={formData.entry_date}
                      onChange={(e) =>
                        setFormData({ ...formData, entry_date: e.target.value })
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
                    {editingItem ? "Atualizar" : "Adicionar"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-card rounded-lg shadow-soft overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : stock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Nenhum item no estoque
                    </TableCell>
                  </TableRow>
                ) : (
                  stock.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.wood_type}</TableCell>
                      <TableCell>{item.quantity} m³</TableCell>
                      <TableCell>{item.suppliers?.name || "-"}</TableCell>
                      <TableCell>
                        {new Date(item.entry_date).toLocaleDateString("pt-BR")}
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

export default Estoque;
