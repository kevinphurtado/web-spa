import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type GalleryImage, type InsertGalleryImage, insertGalleryImageSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Lightbox from "@/components/ui/lightbox";

export default function GalleryManager() {
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
  });

  const form = useForm<InsertGalleryImage>({
    resolver: zodResolver(insertGalleryImageSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      category: "",
      description: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertGalleryImage) => apiRequest("POST", "/api/gallery", data),
    onSuccess: () => {
      toast({
        title: "Imagen añadida",
        description: "La imagen ha sido añadida a la galería exitosamente.",
      });
      form.reset();
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo añadir la imagen.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertGalleryImage> }) =>
      apiRequest("PATCH", `/api/gallery/${id}`, data),
    onSuccess: () => {
      toast({
        title: "Imagen actualizada",
        description: "La imagen ha sido actualizada exitosamente.",
      });
      form.reset();
      setEditingImage(null);
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la imagen.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/gallery/${id}`),
    onSuccess: () => {
      toast({
        title: "Imagen eliminada",
        description: "La imagen ha sido eliminada de la galería.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la imagen.",
        variant: "destructive",
      });
    },
  });

  const categories = [
    { id: "all", label: "Todas" },
    { id: "facilities", label: "Instalaciones" },
    { id: "treatments", label: "Tratamientos" },
    { id: "products", label: "Productos" }
  ];

  const filteredImages = images?.filter((image: GalleryImage) => 
    selectedCategory === "all" || image.category === selectedCategory
  ) || [];

  const onSubmit = (data: InsertGalleryImage) => {
    if (editingImage) {
      updateMutation.mutate({ id: editingImage.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    form.reset({
      title: image.title,
      imageUrl: image.imageUrl,
      category: image.category,
      description: image.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta imagen?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    form.reset();
    setEditingImage(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestión de Galería</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-gray-300 rounded-lg animate-pulse h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Galería</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} data-testid="button-add-image">
              <i className="fas fa-plus mr-2"></i>
              Nueva Imagen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingImage ? "Editar Imagen" : "Nueva Imagen"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título *</label>
                <Input
                  {...form.register("title")}
                  placeholder="Título de la imagen"
                  data-testid="input-image-title"
                />
                {form.formState.errors.title && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.title.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL de Imagen *</label>
                <Input
                  {...form.register("imageUrl")}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  data-testid="input-image-url"
                />
                {form.formState.errors.imageUrl && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.imageUrl.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Categoría *</label>
                <Select onValueChange={(value) => form.setValue("category", value)}>
                  <SelectTrigger data-testid="select-image-category">
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facilities">Instalaciones</SelectItem>
                    <SelectItem value="treatments">Tratamientos</SelectItem>
                    <SelectItem value="products">Productos</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.category.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <Textarea
                  {...form.register("description")}
                  rows={3}
                  placeholder="Descripción opcional de la imagen"
                  data-testid="textarea-image-description"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  data-testid="button-cancel-image"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-image"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      {editingImage ? "Actualizar" : "Añadir"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            size="sm"
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            data-testid={`filter-${category.id}`}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image: GalleryImage) => (
          <div key={image.id} className="relative group">
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-full h-48 object-cover rounded-lg cursor-pointer"
              onClick={() => setLightboxImage(image)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage(image);
                  }}
                  data-testid={`button-view-image-${image.id}`}
                >
                  <i className="fas fa-eye"></i>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(image);
                  }}
                  data-testid={`button-edit-image-${image.id}`}
                >
                  <i className="fas fa-edit"></i>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(image.id);
                  }}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-image-${image.id}`}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 rounded-b-lg">
              <p className="text-sm font-medium truncate">{image.title}</p>
              <p className="text-xs opacity-75 capitalize">{image.category}</p>
            </div>
          </div>
        ))}
      </div>

      {!filteredImages.length && (
        <div className="text-center py-12">
          <i className="fas fa-images text-gray-400 text-6xl mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedCategory === "all" ? "No hay imágenes" : "No hay imágenes en esta categoría"}
          </h3>
          <p className="text-gray-500">
            {selectedCategory === "all" 
              ? "Añade tu primera imagen para comenzar."
              : "Cambia el filtro o añade imágenes a esta categoría."
            }
          </p>
        </div>
      )}

      {lightboxImage && (
        <Lightbox 
          image={lightboxImage} 
          onClose={() => setLightboxImage(null)} 
        />
      )}
    </div>
  );
}
