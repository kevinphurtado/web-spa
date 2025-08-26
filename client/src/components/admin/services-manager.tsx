import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Service, type InsertService, insertServiceSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ServicesManager() {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const form = useForm<InsertService>({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 0,
      imageUrl: "",
      category: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertService) => apiRequest("POST", "/api/services", data),
    onSuccess: () => {
      toast({
        title: "Servicio creado",
        description: "El servicio ha sido creado exitosamente.",
      });
      form.reset();
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear el servicio.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertService> }) =>
      apiRequest("PATCH", `/api/services/${id}`, data),
    onSuccess: () => {
      toast({
        title: "Servicio actualizado",
        description: "El servicio ha sido actualizado exitosamente.",
      });
      form.reset();
      setEditingService(null);
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el servicio.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/services/${id}`),
    onSuccess: () => {
      toast({
        title: "Servicio eliminado",
        description: "El servicio ha sido eliminado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el servicio.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertService) => {
    // Convert price to cents
    const serviceData = {
      ...data,
      price: Math.round(data.price * 100), // Convert to cents
    };

    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data: serviceData });
    } else {
      createMutation.mutate(serviceData);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    form.reset({
      name: service.name,
      description: service.description,
      price: service.price / 100, // Convert from cents to display value
      duration: service.duration,
      imageUrl: service.imageUrl,
      category: service.category,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este servicio?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(priceInCents / 100);
  };

  const resetForm = () => {
    form.reset();
    setEditingService(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestión de Servicios</h1>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Servicios</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} data-testid="button-add-service">
              <i className="fas fa-plus mr-2"></i>
              Nuevo Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Editar Servicio" : "Nuevo Servicio"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre *</label>
                  <Input
                    {...form.register("name")}
                    placeholder="Nombre del servicio"
                    data-testid="input-service-name"
                  />
                  {form.formState.errors.name && (
                    <span className="text-red-500 text-sm">
                      {form.formState.errors.name.message}
                    </span>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Categoría *</label>
                  <Select onValueChange={(value) => form.setValue("category", value)}>
                    <SelectTrigger data-testid="select-service-category">
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facial">Faciales</SelectItem>
                      <SelectItem value="massage">Masajes</SelectItem>
                      <SelectItem value="body">Corporales</SelectItem>
                      <SelectItem value="package">Paquetes</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <span className="text-red-500 text-sm">
                      {form.formState.errors.category.message}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción *</label>
                <Textarea
                  {...form.register("description")}
                  rows={3}
                  placeholder="Descripción del servicio"
                  data-testid="textarea-service-description"
                />
                {form.formState.errors.description && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.description.message}
                  </span>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Precio (COP) *</label>
                  <Input
                    {...form.register("price", { valueAsNumber: true })}
                    type="number"
                    placeholder="120000"
                    data-testid="input-service-price"
                  />
                  {form.formState.errors.price && (
                    <span className="text-red-500 text-sm">
                      {form.formState.errors.price.message}
                    </span>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Duración (minutos) *</label>
                  <Input
                    {...form.register("duration", { valueAsNumber: true })}
                    type="number"
                    placeholder="90"
                    data-testid="input-service-duration"
                  />
                  {form.formState.errors.duration && (
                    <span className="text-red-500 text-sm">
                      {form.formState.errors.duration.message}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL de Imagen *</label>
                <Input
                  {...form.register("imageUrl")}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  data-testid="input-service-image"
                />
                {form.formState.errors.imageUrl && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.imageUrl.message}
                  </span>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  data-testid="button-cancel-service"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-service"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      {editingService ? "Actualizar" : "Crear"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {services.map((service: Service) => (
          <Card key={service.id} className="overflow-hidden">
            <div className="flex">
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-32 h-32 object-cover"
              />
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-spa-dark">
                    {service.name}
                  </h3>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                      data-testid={`button-edit-service-${service.id}`}
                    >
                      <i className="fas fa-edit mr-1"></i>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(service.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-service-${service.id}`}
                    >
                      <i className="fas fa-trash mr-1"></i>
                      Eliminar
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{service.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-spa-green">
                      {formatPrice(service.price)}
                    </span>
                    <span className="text-gray-500">
                      <i className="fas fa-clock mr-1"></i>
                      {service.duration} min
                    </span>
                    <span className="text-gray-500 capitalize">
                      <i className="fas fa-tag mr-1"></i>
                      {service.category}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    service.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!services?.length && (
        <div className="text-center py-12">
          <i className="fas fa-spa text-gray-400 text-6xl mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay servicios</h3>
          <p className="text-gray-500">Crea tu primer servicio para comenzar.</p>
        </div>
      )}
    </div>
  );
}
