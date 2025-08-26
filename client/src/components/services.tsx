import { useQuery } from "@tanstack/react-query";
import { type Service } from "@shared/schema";

export default function Services() {
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(priceInCents / 100);
  };

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-spa-light">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-spa-dark mb-4">
              Servicios Estrella
            </h2>
            <div className="w-20 h-1 bg-spa-green mx-auto mb-6"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="w-full h-64 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-spa-light">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-spa-dark mb-4">
            Servicios Estrella
          </h2>
          <div className="w-20 h-1 bg-spa-green mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tratamientos diseñados para revitalizar tu cuerpo y alma con técnicas profesionales y productos premium.
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service: Service) => (
            <div 
              key={service.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              data-testid={`card-service-${service.id}`}
            >
              <div className="overflow-hidden">
                <img 
                  src={service.imageUrl} 
                  alt={service.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-playfair text-2xl font-semibold text-spa-green mb-3">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-spa-dark font-semibold">
                    {formatPrice(service.price)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {service.duration} min
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Services Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center bg-spa-green text-white px-8 py-3 rounded-full font-semibold hover:bg-spa-dark transition-colors duration-200">
            Ver Todos los Servicios
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
