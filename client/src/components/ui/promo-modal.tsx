import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Promotion, SystemSetting } from "@shared/schema";

export default function PromoModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: promotions = [] } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions", { active: true }],
    queryFn: () => fetch("/api/promotions?active=true").then(res => res.json()),
  });

  const { data: settings = [] } = useQuery<SystemSetting[]>({
    queryKey: ["/api/system-settings"],
    queryFn: () => fetch("/api/system-settings").then(res => res.json()),
  });

  const getSetting = (key: string, defaultValue: string) => {
    const setting = settings.find(s => s.key === key);
    return setting?.value || defaultValue;
  };

  const isPopupEnabled = getSetting("popup_enabled", "true") === "true";
  const popupDelay = parseInt(getSetting("popup_delay", "5000"));
  const popupInterval = parseInt(getSetting("popup_interval", "4000"));

  const promos = promotions.map(promo => ({
    image: promo.imageUrl,
    title: promo.title,
    description: promo.description,
  }));

  useEffect(() => {
    if (!isPopupEnabled || promos.length === 0) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, popupDelay);

    return () => clearTimeout(timer);
  }, [isPopupEnabled, promos.length, popupDelay]);

  useEffect(() => {
    if (!isVisible || promos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promos.length);
    }, popupInterval);

    return () => clearInterval(interval);
  }, [isVisible, promos.length, popupInterval]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promos.length) % promos.length);
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  if (!isVisible || !isPopupEnabled || promos.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-auto relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          data-testid="button-close-promo"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="text-center">
          <div className="relative overflow-hidden rounded-xl mb-6">
            <img
              src={promos[currentSlide].image}
              alt={promos[currentSlide].title}
              className="w-full h-48 object-cover"
              data-testid="promo-image"
            />
            
            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
              data-testid="button-prev-promo"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
              data-testid="button-next-promo"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <h3 className="font-playfair text-2xl font-bold text-spa-dark mb-4">
            {promos[currentSlide].title}
          </h3>
          <p className="text-gray-600 mb-6">
            {promos[currentSlide].description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://purezadepielspa.agendapro.com/co"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-spa-green text-white px-6 py-3 rounded-full font-semibold hover:bg-spa-dark transition-colors"
              data-testid="link-claim-offer"
            >
              Reclamar Oferta
            </a>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              data-testid="button-maybe-later"
            >
              Tal vez después
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {promos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-spa-green' : 'bg-gray-300'
                }`}
                data-testid={`promo-dot-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
