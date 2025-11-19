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

const Caminhoes = () => {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    license_plate: "",
    driver_name: "",
    supplier_id: "",
    wood_type: "",
    quantity: "",
    delivery_date: new Date().toISOString().slice(0, 16),
    notes: "",
  });

  useEffect(() => {
    fetchTrucks();
    fetchSuppliers();
  }, []);

  const fetchTrucks = async () => {
    try {
      const { data, error } = await supabase
        .from("trucks")
        .select("*, suppliers(name)")
        .order("delivery_date", { ascending: false });

      if (error) throw error;
      setTrucks(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar caminhões",
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
          .from("trucks")
          .update({
            ...formData,
            quantity: parseFloat(formData.quantity),
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        toast({ title: "Registro atualizado com sucesso!" });
      } else {
        const { error: truckError } = await supabase.from("trucks").insert([
          {
            ...formData,
            quantity: parseFloat(formData.quantity),
            created_by: user?.id,
          },
        ]);

        if (truckError) throw truckError;

        // Adicionar ao estoque automaticamente
        const { error: stockError } = await supabase.from("wood_stock").insert([
          {
            wood_type: formData.wood_type,
            quantity: parseFloat(formData.quantity),
            supplier_id: formData.supplier_id || null,
            entry_date: formData.delivery_date.split("T")[0],
            notes: `Recebido de caminhão: ${formData.license_plate}`,
            created_by: user?.id,
          },
        ]);

        if (stockError) throw stockError;

        toast({ title: "Caminhão registrado e estoque atualizado!" });
      }

      setDialogOpen(false);
      resetForm();
      fetchTrucks();
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
      license_plate: item.license_plate,
      driver_name: item.driver_name,
      supplier_id: item.supplier_id || "",
      wood_type: item.wood_type,
      quantity: item.quantity.toString(),
      delivery_date: item.delivery_date.slice(0, 16),
      notes: item.notes || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;

    try {
      const { error } = await supabase.from("trucks").delete().eq("id", id);
      if (error) throw error;

      toast({ title: "Registro removido com sucesso!" });
      fetchTrucks();
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
      license_plate: "",
      driver_name: "",
      supplier_id: "",
      wood_type: "",
      quantity: "",
      delivery_date: new Date().toISOString().slice(0, 16),
      notes: "",
    });
    setEditingItem(null);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-display font-bold text-3xl">Caminhões</h1>
              <p className="text-muted-foreground">Registro de entregas</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-forest" onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Entrega
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Editar Registro" : "Registrar Entrega"}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os dados da entrega
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="license_plate">Placa do Caminhão *</Label>
                    <Input
                      id="license_plate"
                      value={formData.license_plate}
                      onChange={(e) =>
                        setFormData({ ...formData, license_plate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="driver_name">Nome do Motorista *</Label>
                    <Input
                      id="driver_name"
                      value={formData.driver_name}
                      onChange={(e) =>
                        setFormData({ ...formData, driver_name: e.target.value })
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
                    <Label htmlFor="delivery_date">Data e Hora *</Label>
                    <Input
                      id="delivery_date"
                      type="datetime-local"
                      value={formData.delivery_date}
                      onChange={(e) =>
                        setFormData({ ...formData, delivery_date: e.target.value })
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
                  <TableHead>Placa</TableHead>
                  <TableHead>Motorista</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Madeira</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Data</TableHead>
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
                ) : trucks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Nenhuma entrega registrada
                    </TableCell>
                  </TableRow>
                ) : (
                  trucks.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.license_plate}</TableCell>
                      <TableCell>{item.driver_name}</TableCell>
                      <TableCell>{item.suppliers?.name || "-"}</TableCell>
                      <TableCell>{item.wood_type}</TableCell>
                      <TableCell>{item.quantity} m³</TableCell>
                      <TableCell>
                        {new Date(item.delivery_date).toLocaleString("pt-BR")}
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

export default Caminhoes;
