import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Testimonial, type InsertTestimonial, insertTestimonialSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TestimonialsManager() {
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  const form = useForm<InsertTestimonial>({
    resolver: zodResolver(insertTestimonialSchema),
    defaultValues: {
      name: "",
      location: "",
      quote: "",
      rating: 5,
      avatarUrl: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertTestimonial) => apiRequest("POST", "/api/testimonials", data),
    onSuccess: () => {
      toast({
        title: "Testimonio creado",
        description: "El testimonio ha sido creado exitosamente.",
      });
      form.reset();
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear el testimonio.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Testimonial> }) =>
      apiRequest("PATCH", `/api/testimonials/${id}`, data),
    onSuccess: () => {
      toast({
        title: "Testimonio actualizado",
        description: "El testimonio ha sido actualizado exitosamente.",
      });
      form.reset();
      setEditingTestimonial(null);
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el testimonio.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/testimonials/${id}`),
    onSuccess: () => {
      toast({
        title: "Testimonio eliminado",
        description: "El testimonio ha sido eliminado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el testimonio.",
        variant: "destructive",
      });
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) =>
      apiRequest("PATCH", `/api/testimonials/${id}`, { approved }),
    onSuccess: () => {
      toast({
        title: "Estado actualizado",
        description: "El estado del testimonio ha sido actualizado.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTestimonial) => {
    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    form.reset({
      name: testimonial.name,
      location: testimonial.location,
      quote: testimonial.quote,
      rating: testimonial.rating,
      avatarUrl: testimonial.avatarUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este testimonio?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleApproval = (id: string, currentStatus: boolean) => {
    approveMutation.mutate({ id, approved: !currentStatus });
  };

  const resetForm = () => {
    form.reset();
    setEditingTestimonial(null);
    setIsDialogOpen(false);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fas fa-star ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestión de Testimonios</h1>
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
        <h1 className="text-3xl font-bold">Gestión de Testimonios</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} data-testid="button-add-testimonial">
              <i className="fas fa-plus mr-2"></i>
              Nuevo Testimonio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? "Editar Testimonio" : "Nuevo Testimonio"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre *</label>
                  <Input
                    {...form.register("name")}
                    placeholder="Nombre del cliente"
                    data-testid="input-testimonial-name"
                  />
                  {form.formState.errors.name && (
                    <span className="text-red-500 text-sm">
                      {form.formState.errors.name.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ubicación *</label>
                  <Input
                    {...form.register("location")}
                    placeholder="Ciudad, País"
                    data-testid="input-testimonial-location"
                  />
                  {form.formState.errors.location && (
                    <span className="text-red-500 text-sm">
                      {form.formState.errors.location.message}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Testimonio *</label>
                <Textarea
                  {...form.register("quote")}
                  rows={4}
                  placeholder="Testimonio del cliente..."
                  data-testid="textarea-testimonial-quote"
                />
                {form.formState.errors.quote && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.quote.message}
                  </span>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Calificación *</label>
                  <select
                    {...form.register("rating", { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spa-green focus:border-transparent"
                    data-testid="select-testimonial-rating"
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} estrella{rating !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.rating && (
                    <span className="text-red-500 text-sm">
                      {form.formState.errors.rating.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL Avatar</label>
                  <Input
                    {...form.register("avatarUrl")}
                    placeholder="https://ejemplo.com/avatar.jpg"
                    data-testid="input-testimonial-avatar"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  data-testid="button-cancel-testimonial"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-testimonial"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      {editingTestimonial ? "Actualizar" : "Crear"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {testimonials.map((testimonial: Testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  {testimonial.avatarUrl && (
                    <img
                      src={testimonial.avatarUrl}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <p className="text-gray-600">{testimonial.location}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={testimonial.approved ? "default" : "secondary"}>
                    {testimonial.approved ? "Aprobado" : "Pendiente"}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant={testimonial.approved ? "outline" : "default"}
                      onClick={() => handleToggleApproval(testimonial.id, testimonial.approved || false)}
                      disabled={approveMutation.isPending}
                      data-testid={`button-toggle-approval-${testimonial.id}`}
                    >
                      <i className={`fas fa-${testimonial.approved ? 'eye-slash' : 'eye'} mr-1`}></i>
                      {testimonial.approved ? 'Ocultar' : 'Aprobar'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(testimonial)}
                      data-testid={`button-edit-testimonial-${testimonial.id}`}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(testimonial.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-testimonial-${testimonial.id}`}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <blockquote className="text-gray-700 italic border-l-4 border-spa-green pl-4">
                "{testimonial.quote}"
              </blockquote>
            </CardContent>
          </Card>
        ))}
      </div>

      {!testimonials?.length && (
        <div className="text-center py-12">
          <i className="fas fa-comments text-gray-400 text-6xl mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay testimonios</h3>
          <p className="text-gray-500">Crea tu primer testimonio para comenzar.</p>
        </div>
      )}
    </div>
  );
}
