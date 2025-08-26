import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type GalleryImage } from "@shared/schema";
import Lightbox from "@/components/ui/lightbox";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const { data: images = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
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

  if (isLoading) {
    return (
      <section id="gallery" className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-spa-dark mb-4">
              Galería de Experiencias
            </h2>
            <div className="w-20 h-1 bg-spa-green mx-auto mb-6"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-300 rounded-lg animate-pulse h-48"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-spa-dark mb-4">
            Galería de Experiencias
          </h2>
          <div className="w-20 h-1 bg-spa-green mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Descubre nuestras instalaciones y vive la experiencia de bienestar que te espera.
          </p>
        </div>
        
        {/* Gallery Filter */}
        <div className="flex flex-wrap justify-center mb-12 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-spa-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-spa-green hover:text-white'
              }`}
              data-testid={`filter-${category.id}`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image: GalleryImage) => (
            <div 
              key={image.id}
              className="group cursor-pointer relative overflow-hidden rounded-lg"
              onClick={() => setLightboxImage(image)}
              data-testid={`image-${image.id}`}
            >
              <img 
                src={image.imageUrl} 
                alt={image.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <i className="fas fa-search-plus text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More Button */}
        <div className="text-center mt-12">
          <button 
            className="bg-spa-green text-white px-8 py-3 rounded-full font-semibold hover:bg-spa-dark transition-colors duration-200"
            data-testid="button-load-more"
          >
            Cargar Más Imágenes
          </button>
        </div>
      </div>

      {lightboxImage && (
        <Lightbox 
          image={lightboxImage} 
          onClose={() => setLightboxImage(null)} 
        />
      )}
    </section>
  );
}
