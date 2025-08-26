import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-effect bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="font-playfair text-2xl lg:text-3xl font-bold text-spa-dark"
            data-testid="link-logo"
          >
            Pureza<span className="text-spa-green">dePiel</span>
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('services')}
              className="text-spa-dark hover:text-spa-green transition-colors duration-200 font-medium"
              data-testid="link-services"
            >
              Servicios
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="text-spa-dark hover:text-spa-green transition-colors duration-200 font-medium"
              data-testid="link-gallery"
            >
              Galería
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-spa-dark hover:text-spa-green transition-colors duration-200 font-medium"
              data-testid="link-testimonials"
            >
              Testimonios
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-spa-dark hover:text-spa-green transition-colors duration-200 font-medium"
              data-testid="link-contact"
            >
              Contacto
            </button>
            <Link 
              href="/admin"
              className="bg-spa-green text-white px-6 py-2 rounded-full hover:bg-spa-dark transition-colors duration-200 font-medium"
              data-testid="link-admin"
            >
              Admin
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-spa-dark"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg">
          <div className="px-4 py-3 space-y-3">
            <button 
              onClick={() => scrollToSection('services')}
              className="block w-full text-left text-spa-dark hover:text-spa-green transition-colors"
              data-testid="link-mobile-services"
            >
              Servicios
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="block w-full text-left text-spa-dark hover:text-spa-green transition-colors"
              data-testid="link-mobile-gallery"
            >
              Galería
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="block w-full text-left text-spa-dark hover:text-spa-green transition-colors"
              data-testid="link-mobile-testimonials"
            >
              Testimonios
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left text-spa-dark hover:text-spa-green transition-colors"
              data-testid="link-mobile-contact"
            >
              Contacto
            </button>
            <Link 
              href="/admin"
              className="block bg-spa-green text-white px-4 py-2 rounded-full text-center"
              data-testid="link-mobile-admin"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
