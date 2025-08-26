import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPromotionSchema, type Promotion, type InsertPromotion } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";

export default function PromotionsManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: promotions = [], isLoading } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions"],
  });

  const { data: systemSettings = [] } = useQuery({
    queryKey: ["/api/system-settings"],
  });

  const form = useForm<InsertPromotion>({
    resolver: zodResolver(insertPromotionSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      active: true,
      order: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertPromotion) => apiRequest("/api/promotions", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Promoción creada",
        description: "La promoción se ha creado exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la promoción.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertPromotion> }) =>
      apiRequest(`/api/promotions/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      setEditingPromotion(null);
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Promoción actualizada",
        description: "La promoción se ha actualizado exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la promoción.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/promotions/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      toast({
        title: "Promoción eliminada",
        description: "La promoción se ha eliminado exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la promoción.",
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      apiRequest(`/api/promotions/${id}`, "PATCH", { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      toast({
        title: "Promoción actualizada",
        description: "El estado de la promoción se ha actualizado.",
      });
    },
  });

  const updateSystemSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      apiRequest(`/api/system-settings/${key}`, "PUT", { value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/system-settings"] });
      toast({
        title: "Configuración actualizada",
        description: "La configuración del sistema se ha actualizado.",
      });
    },
  });

  const onSubmit = (data: InsertPromotion) => {
    if (editingPromotion) {
      updateMutation.mutate({ id: editingPromotion.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    form.reset({
      title: promotion.title,
      description: promotion.description,
      imageUrl: promotion.imageUrl,
      active: promotion.active || false,
      order: promotion.order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta promoción?")) {
      deleteMutation.mutate(id);
    }
  };

  const getSettingValue = (key: string) => {
    const setting = systemSettings.find((s: any) => s.key === key);
    return setting?.value || "";
  };

  const updateSetting = (key: string, value: string) => {
    updateSystemSettingMutation.mutate({ key, value });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Cargando promociones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Promociones</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setEditingPromotion(null);
                form.reset();
              }}
              data-testid="button-add-promotion"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Promoción
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPromotion ? "Editar Promoción" : "Nueva Promoción"}
              </DialogTitle>
              <DialogDescription>
                {editingPromotion 
                  ? "Modifica los datos de la promoción"
                  : "Crea una nueva promoción para el popup"
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej: ✨ Promoción Facial ✨" data-testid="input-promotion-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe la promoción..." data-testid="input-promotion-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de Imagen</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." data-testid="input-promotion-image" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orden</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          placeholder="0"
                          data-testid="input-promotion-order"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Activo</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-promotion-active" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-promotion"
                  >
                    {createMutation.isPending || updateMutation.isPending 
                      ? "Guardando..." 
                      : editingPromotion ? "Actualizar" : "Crear"
                    }
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel-promotion"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Configuración del Popup */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Popup</CardTitle>
          <CardDescription>
            Controla cuándo y cómo se muestra el popup de promociones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Popup habilitado</Label>
            <Switch
              checked={getSettingValue("popup_enabled") === "true"}
              onCheckedChange={(checked) => updateSetting("popup_enabled", checked.toString())}
              data-testid="switch-popup-enabled"
            />
          </div>
          <div className="space-y-2">
            <Label>Retraso antes de mostrar (milisegundos)</Label>
            <Input
              type="number"
              value={getSettingValue("popup_delay")}
              onChange={(e) => updateSetting("popup_delay", e.target.value)}
              placeholder="5000"
              data-testid="input-popup-delay"
            />
          </div>
          <div className="space-y-2">
            <Label>Intervalo entre slides (milisegundos)</Label>
            <Input
              type="number"
              value={getSettingValue("popup_interval")}
              onChange={(e) => updateSetting("popup_interval", e.target.value)}
              placeholder="4000"
              data-testid="input-popup-interval"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Promociones */}
      <div className="grid gap-4">
        {promotions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No hay promociones configuradas</p>
            </CardContent>
          </Card>
        ) : (
          promotions.map((promotion) => (
            <Card key={promotion.id} className="flex items-center gap-4 p-4">
              <img 
                src={promotion.imageUrl} 
                alt={promotion.title}
                className="w-16 h-16 object-cover rounded-lg"
                data-testid={`img-promotion-${promotion.id}`}
              />
              <div className="flex-1">
                <h3 className="font-semibold" data-testid={`text-promotion-title-${promotion.id}`}>
                  {promotion.title}
                </h3>
                <p className="text-sm text-gray-600" data-testid={`text-promotion-description-${promotion.id}`}>
                  {promotion.description}
                </p>
                <p className="text-xs text-gray-400">Orden: {promotion.order}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleActiveMutation.mutate({ 
                    id: promotion.id, 
                    active: !promotion.active 
                  })}
                  data-testid={`button-toggle-${promotion.id}`}
                >
                  {promotion.active ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(promotion)}
                  data-testid={`button-edit-${promotion.id}`}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(promotion.id)}
                  data-testid={`button-delete-${promotion.id}`}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}