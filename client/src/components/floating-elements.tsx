import { useState, useEffect } from "react";

export default function FloatingElements() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* WhatsApp Float */}
      <a 
        href="https://api.whatsapp.com/send?phone=573146271635&text=Hola%2C%20me%20gustaría%20información%20sobre%20sus%20servicios" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-200 z-50 animate-float"
        data-testid="link-whatsapp-float"
      >
        <i className="fab fa-whatsapp text-2xl"></i>
      </a>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-secondary transition-all duration-200 z-40"
          data-testid="button-scroll-top"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </>
  );
}
