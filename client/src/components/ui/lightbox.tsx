import { type GalleryImage } from "@shared/schema";

interface LightboxProps {
  image: GalleryImage;
  onClose: () => void;
}

export default function Lightbox({ image, onClose }: LightboxProps) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      data-testid="lightbox-overlay"
    >
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 transition-colors"
          data-testid="button-close-lightbox"
        >
          <i className="fas fa-times"></i>
        </button>
        
        <img
          src={image.imageUrl}
          alt={image.title}
          className="max-w-full max-h-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
          data-testid="lightbox-image"
        />
        
        {image.description && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 rounded-b-lg">
            <h3 className="font-semibold mb-1">{image.title}</h3>
            <p className="text-sm opacity-80">{image.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
