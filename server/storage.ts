import { 
  type Service, type InsertService,
  type Appointment, type InsertAppointment,
  type Testimonial, type InsertTestimonial,
  type GalleryImage, type InsertGalleryImage,
  type ContactMessage, type InsertContactMessage,
  type NewsletterSubscriber, type InsertNewsletterSubscriber,
  type User, type InsertUser,
  type Promotion, type InsertPromotion,
  type SystemSetting, type InsertSystemSetting
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Services
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;

  // Appointments
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: string): Promise<boolean>;

  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  getApprovedTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;

  // Gallery
  getGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImage(id: string): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: string, image: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined>;
  deleteGalleryImage(id: string): Promise<boolean>;

  // Contact Messages
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: string): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessage(id: string, message: Partial<ContactMessage>): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: string): Promise<boolean>;

  // Newsletter
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  deleteNewsletterSubscriber(id: string): Promise<boolean>;

  // Promotions
  getPromotions(): Promise<Promotion[]>;
  getActivePromotions(): Promise<Promotion[]>;
  getPromotion(id: string): Promise<Promotion | undefined>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  updatePromotion(id: string, promotion: Partial<InsertPromotion>): Promise<Promotion | undefined>;
  deletePromotion(id: string): Promise<boolean>;

  // System Settings
  getSystemSettings(): Promise<SystemSetting[]>;
  getSystemSetting(key: string): Promise<SystemSetting | undefined>;
  setSystemSetting(setting: InsertSystemSetting): Promise<SystemSetting>;
  updateSystemSetting(key: string, value: string): Promise<SystemSetting | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private services: Map<string, Service> = new Map();
  private appointments: Map<string, Appointment> = new Map();
  private testimonials: Map<string, Testimonial> = new Map();
  private galleryImages: Map<string, GalleryImage> = new Map();
  private contactMessages: Map<string, ContactMessage> = new Map();
  private newsletterSubscribers: Map<string, NewsletterSubscriber> = new Map();
  private promotions: Map<string, Promotion> = new Map();
  private systemSettings: Map<string, SystemSetting> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed initial services
    const services = [
      {
        id: randomUUID(),
        name: "Faciales Premium",
        description: "Limpieza profunda, hidratación y rejuvenecimiento con productos de alta gama y técnicas especializadas.",
        price: 12000000, // 120,000 COP in cents
        duration: 90,
        imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        category: "facial",
        active: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Masajes Terapéuticos",
        description: "Relajantes, descontracturantes y terapéuticos con aromaterapia para liberar tensiones y estrés.",
        price: 9000000, // 90,000 COP in cents
        duration: 60,
        imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        category: "massage",
        active: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Corporales Especializados",
        description: "Maderoterapia, reducción de medidas, exfoliaciones y tratamientos reductivos personalizados.",
        price: 15000000, // 150,000 COP in cents
        duration: 120,
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        category: "body",
        active: true,
        createdAt: new Date(),
      }
    ];

    services.forEach(service => this.services.set(service.id, service));

    // Seed initial testimonials
    const testimonials = [
      {
        id: randomUUID(),
        name: "Ana María Rodríguez",
        location: "Quibdó, Chocó",
        quote: "Increíble experiencia en Pureza de Piel. El ambiente es muy relajante y profesional. Salí completamente renovada y con una piel radiante.",
        rating: 5,
        avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        approved: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Carlos Hernández",
        location: "Medellín, Antioquia",
        quote: "El masaje terapéutico fue exactamente lo que necesitaba. Personal muy capacitado y un servicio excepcional. El lugar es hermoso y muy limpio.",
        rating: 5,
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        approved: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Laura Vásquez",
        location: "Bogotá, Cundinamarca",
        quote: "Excelente atención desde el primer momento. Los tratamientos corporales son increíbles y los resultados son visibles desde la primera sesión.",
        rating: 5,
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        approved: true,
        createdAt: new Date(),
      }
    ];

    testimonials.forEach(testimonial => this.testimonials.set(testimonial.id, testimonial));

    // Seed gallery images
    const galleryImages = [
      {
        id: randomUUID(),
        title: "Recepción del spa",
        imageUrl: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "facilities",
        description: "Nuestra elegante área de recepción",
        active: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Sala de tratamientos",
        imageUrl: "https://images.unsplash.com/photo-1591343395082-e120087004b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        category: "treatments",
        description: "Espacios diseñados para tu relajación",
        active: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Productos premium",
        imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "products",
        description: "Productos de la más alta calidad",
        active: true,
        createdAt: new Date(),
      }
    ];

    galleryImages.forEach(image => this.galleryImages.set(image.id, image));

    // Seed promotions
    const promotions = [
      {
        id: randomUUID(),
        title: "✨ Promoción Facial ✨",
        description: "Limpieza facial + hidratación profunda con 25% de descuento.",
        imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        active: true,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "🌿 Masaje Relajante 🌿", 
        description: "Masaje de 60 min + aromaterapia a un precio especial.",
        imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        active: true,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "💚 Pack Corporal 💚",
        description: "Maderoterapia + exfoliación corporal con 20% OFF.",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        active: true,
        order: 3,
        createdAt: new Date(),
      }
    ];

    promotions.forEach(promotion => this.promotions.set(promotion.id, promotion));

    // Seed system settings
    const systemSettings = [
      {
        id: randomUUID(),
        key: "popup_enabled",
        value: "true",
        description: "Control si el popup de promociones está habilitado",
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        key: "popup_delay",
        value: "5000",
        description: "Tiempo en milisegundos antes de mostrar el popup",
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        key: "popup_interval",
        value: "4000",
        description: "Tiempo en milisegundos entre slides del popup",
        updatedAt: new Date(),
      }
    ];

    systemSettings.forEach(setting => this.systemSettings.set(setting.key, setting));

    // Seed admin user
    const adminUser = {
      id: randomUUID(),
      username: "admin",
      password: "admin123",
      role: "admin"
    };
    this.users.set(adminUser.id, adminUser);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      role: "admin" 
    };
    this.users.set(id, user);
    return user;
  }

  // Services
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.active);
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = {
      ...insertService,
      id,
      active: true,
      createdAt: new Date(),
    };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: string, updates: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    
    const updatedService = { ...service, ...updates };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: string): Promise<boolean> {
    return this.services.delete(id);
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      status: "pending",
      serviceId: insertAppointment.serviceId || null,
      notes: insertAppointment.notes || null,
      createdAt: new Date(),
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment = { ...appointment, ...updates };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    return this.appointments.delete(id);
  }

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values())
      .filter(testimonial => testimonial.approved)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = randomUUID();
    const testimonial: Testimonial = {
      ...insertTestimonial,
      id,
      approved: false,
      rating: insertTestimonial.rating || 5,
      avatarUrl: insertTestimonial.avatarUrl || null,
      createdAt: new Date(),
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;
    
    const updatedTestimonial = { ...testimonial, ...updates };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    return this.testimonials.delete(id);
  }

  // Gallery
  async getGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values())
      .filter(image => image.active)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getGalleryImage(id: string): Promise<GalleryImage | undefined> {
    return this.galleryImages.get(id);
  }

  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const id = randomUUID();
    const image: GalleryImage = {
      ...insertImage,
      id,
      description: insertImage.description || null,
      active: true,
      createdAt: new Date(),
    };
    this.galleryImages.set(id, image);
    return image;
  }

  async updateGalleryImage(id: string, updates: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined> {
    const image = this.galleryImages.get(id);
    if (!image) return undefined;
    
    const updatedImage = { ...image, ...updates };
    this.galleryImages.set(id, updatedImage);
    return updatedImage;
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    return this.galleryImages.delete(id);
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getContactMessage(id: string): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = {
      ...insertMessage,
      id,
      serviceInterest: insertMessage.serviceInterest || null,
      status: "unread",
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async updateContactMessage(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage | undefined> {
    const message = this.contactMessages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, ...updates };
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    return this.contactMessages.delete(id);
  }

  // Newsletter
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletterSubscribers.values())
      .filter(subscriber => subscriber.active)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createNewsletterSubscriber(insertSubscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = randomUUID();
    const subscriber: NewsletterSubscriber = {
      ...insertSubscriber,
      id,
      active: true,
      createdAt: new Date(),
    };
    this.newsletterSubscribers.set(id, subscriber);
    return subscriber;
  }

  async deleteNewsletterSubscriber(id: string): Promise<boolean> {
    return this.newsletterSubscribers.delete(id);
  }

  // Promotions
  async getPromotions(): Promise<Promotion[]> {
    return Array.from(this.promotions.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getActivePromotions(): Promise<Promotion[]> {
    return Array.from(this.promotions.values())
      .filter(promotion => promotion.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getPromotion(id: string): Promise<Promotion | undefined> {
    return this.promotions.get(id);
  }

  async createPromotion(insertPromotion: InsertPromotion): Promise<Promotion> {
    const id = randomUUID();
    const promotion: Promotion = {
      ...insertPromotion,
      id,
      active: insertPromotion.active ?? true,
      order: insertPromotion.order ?? 0,
      createdAt: new Date(),
    };
    this.promotions.set(id, promotion);
    return promotion;
  }

  async updatePromotion(id: string, updates: Partial<InsertPromotion>): Promise<Promotion | undefined> {
    const promotion = this.promotions.get(id);
    if (!promotion) return undefined;
    
    const updatedPromotion = { ...promotion, ...updates };
    this.promotions.set(id, updatedPromotion);
    return updatedPromotion;
  }

  async deletePromotion(id: string): Promise<boolean> {
    return this.promotions.delete(id);
  }

  // System Settings
  async getSystemSettings(): Promise<SystemSetting[]> {
    return Array.from(this.systemSettings.values());
  }

  async getSystemSetting(key: string): Promise<SystemSetting | undefined> {
    return this.systemSettings.get(key);
  }

  async setSystemSetting(insertSetting: InsertSystemSetting): Promise<SystemSetting> {
    const id = randomUUID();
    const setting: SystemSetting = {
      ...insertSetting,
      id,
      description: insertSetting.description || null,
      updatedAt: new Date(),
    };
    this.systemSettings.set(insertSetting.key, setting);
    return setting;
  }

  async updateSystemSetting(key: string, value: string): Promise<SystemSetting | undefined> {
    const setting = this.systemSettings.get(key);
    if (!setting) return undefined;
    
    const updatedSetting = { ...setting, value, updatedAt: new Date() };
    this.systemSettings.set(key, updatedSetting);
    return updatedSetting;
  }
}

export const storage = new MemStorage();
