import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Testimonial } from "@shared/schema";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['/api/testimonials'],
    queryFn: () => fetch('/api/testimonials?approved=true').then(res => res.json()),
  });

  useEffect(() => {
    if (!testimonials?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % testimonials.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials?.length]);

  const nextTestimonial = () => {
    if (!testimonials?.length) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (!testimonials?.length) return;
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 bg-spa-dark text-white relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              Testimonios de Nuestros Clientes
            </h2>
            <div className="w-20 h-1 bg-spa-green mx-auto mb-6"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-8 w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-4 w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials?.length) {
    return (
      <section id="testimonials" className="py-20 bg-spa-dark text-white relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              Testimonios de Nuestros Clientes
            </h2>
            <p className="text-gray-300">No hay testimonios disponibles en este momento.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-spa-dark text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 border border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Testimonios de Nuestros Clientes
          </h2>
          <div className="w-20 h-1 bg-spa-green mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Descubre lo que dicen nuestros clientes sobre su experiencia de bienestar.
          </p>
        </div>
        
        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial: Testimonial) => (
                <div 
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                  data-testid={`testimonial-${testimonial.id}`}
                >
                  <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-6">
                      <i className="fas fa-quote-left text-spa-green text-4xl"></i>
                    </div>
                    <blockquote className="text-xl md:text-2xl font-light italic mb-8 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center justify-center">
                      {testimonial.avatarUrl && (
                        <img 
                          src={testimonial.avatarUrl} 
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                      )}
                      <div className="text-left">
                        <p className="font-semibold text-spa-green text-lg">
                          {testimonial.name}
                        </p>
                        <p className="text-gray-300 text-sm">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center mt-4">
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <i key={i} className="fas fa-star text-yellow-400"></i>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
            data-testid="button-prev-testimonial"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button 
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
            data-testid="button-next-testimonial"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-spa-green' : 'bg-gray-400'
                }`}
                data-testid={`dot-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
