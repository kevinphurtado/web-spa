import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-spa-dark text-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="font-playfair text-2xl font-bold mb-4">
              Pureza<span className="text-spa-green">dePiel</span>
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Tu destino de bienestar en Quibdó. Ofrecemos tratamientos especializados para tu cuidado personal y relajación.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-spa-green text-white p-3 rounded-full hover:bg-spa-accent transition-colors duration-200"
                data-testid="footer-link-facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="#" 
                className="bg-spa-green text-white p-3 rounded-full hover:bg-spa-accent transition-colors duration-200"
                data-testid="footer-link-instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="https://api.whatsapp.com/send?phone=573146271635"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-spa-green text-white p-3 rounded-full hover:bg-spa-accent transition-colors duration-200"
                data-testid="footer-link-whatsapp"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Servicios</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="hover:text-spa-green transition-colors"
                  data-testid="footer-link-facials"
                >
                  Tratamientos Faciales
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="hover:text-spa-green transition-colors"
                  data-testid="footer-link-massages"
                >
                  Masajes Terapéuticos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="hover:text-spa-green transition-colors"
                  data-testid="footer-link-body"
                >
                  Corporales
                </button>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-spa-green transition-colors"
                  data-testid="footer-link-packages"
                >
                  Paquetes Especiales
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-spa-green transition-colors"
                  data-testid="footer-link-products"
                >
                  Productos Premium
                </a>
              </li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                {/* --- MODIFICACIÓN PARA "SOBRE NOSOTROS" --- */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="hover:text-spa-green transition-colors" data-testid="footer-link-about">
                      Sobre Nosotros
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg bg-white text-spa-dark">
                    <DialogHeader>
                      <DialogTitle className="font-playfair text-2xl text-spa-dark">Sobre Nosotros</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4 text-gray-600 max-h-[60vh] overflow-y-auto">
                      <p>
                        <strong>Bienvenida a Pureza de Piel.</strong>
                      </p>
                      <p>
                        Nacimos en el corazón de Quibdó con la misión de ser un santuario de paz y bienestar para nuestra comunidad. Creemos que el cuidado personal es una parte esencial de una vida saludable y feliz.
                      </p>
                      <p>
                        Nuestro equipo de profesionales está dedicado a ofrecerte tratamientos de la más alta calidad, utilizando productos premium y técnicas innovadoras para revitalizar tu cuerpo y alma.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('gallery')}
                  className="hover:text-spa-green transition-colors"
                  data-testid="footer-link-gallery"
                >
                  Galería
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="hover:text-spa-green transition-colors"
                  data-testid="footer-link-testimonials"
                >
                  Testimonios
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-spa-green transition-colors"
                  data-testid="footer-link-contact"
                >
                  Contacto
                </button>
              </li>
              <li>
                {/* --- MODIFICACIÓN PARA "POLÍTICA DE PRIVACIDAD" --- */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="hover:text-spa-green transition-colors" data-testid="footer-link-privacy">
                      Política de Privacidad
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg bg-white text-spa-dark">
                    <DialogHeader>
                      <DialogTitle className="font-playfair text-2xl text-spa-dark">Política de Privacidad</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4 text-gray-600 max-h-[60vh] overflow-y-auto">
                      <p>En Pureza de Piel, valoramos tu privacidad y nos comprometemos a proteger tu información personal.</p>
                      <h3 className="font-bold">1. Información que Recopilamos</h3>
                      <p>Recopilamos información que nos proporcionas directamente, como tu nombre, número de teléfono y correo electrónico cuando agendas una cita o te suscribes a nuestro boletín.</p>
                      <h3 className="font-bold">2. Uso de la Información</h3>
                      <p>Utilizamos tu información para gestionar tus citas, mejorar nuestros servicios y, con tu consentimiento, enviarte ofertas especiales.</p>
                      <h3 className="font-bold">3. No Compartimos tu Información</h3>
                      <p>Tu información personal no será compartida con terceros sin tu consentimiento explícito.</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contacto</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <i className="fas fa-map-marker-alt text-spa-green mr-3 mt-1 flex-shrink-0"></i>
                <span>CLL 28 #1 - 92<br />Quibdó, Chocó</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-phone text-spa-green mr-3 flex-shrink-0"></i>
                <span>(314) 627-1635</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-envelope text-spa-green mr-3 flex-shrink-0"></i>
                <span>info@purezadepiel.spa</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-clock text-spa-green mr-3 mt-1 flex-shrink-0"></i>
                <span>Lun - Sáb: 9:00 AM - 7:00 PM</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            &copy; 2025 Pureza de Piel. Todos los derechos reservados.
          </p>
          <div className="flex items-center text-gray-300 text-sm">
            <span>Diseñado con</span>
            <i className="fas fa-heart text-spa-green mx-2"></i>
            <span>para tu bienestar</span>
          </div>
        </div>
      </div>
    </footer>
  );
}