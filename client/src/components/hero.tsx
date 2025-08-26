import { useEffect, useState } from "react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Content */}
      <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Tu cuerpo te habla.<br />
          <span className="text-spa-sage">¡Escúchalo!</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed">
          Descubre un espacio en Quibdó dedicado a tu bienestar. Vive la experiencia Pureza de Piel.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => scrollToSection('contact')}
            className="bg-spa-green text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-spa-dark transform hover:scale-105 transition-all duration-200 shadow-lg"
            data-testid="button-schedule-appointment"
          >
            <i className="fas fa-calendar-alt mr-2"></i>
            Agenda tu Cita
          </button>
          <a 
            href="https://purezadepielspa.agendapro.com/co"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-spa-dark transition-all duration-200"
            data-testid="link-book-online"
          >
            <i className="fas fa-clock mr-2"></i>
            Reserva Online
          </a>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <i className="fas fa-chevron-down text-white text-2xl"></i>
        </div>
      </div>
    </section>
  );
}
