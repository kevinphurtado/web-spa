import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceInterest: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertContactMessage) =>
      apiRequest("POST", "/api/contact-messages", data),
    onSuccess: () => {
      toast({
        title: "Mensaje enviado",
        description: "Nos pondremos en contacto contigo pronto.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Inténtalo nuevamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    mutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 bg-spa-light">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-spa-dark mb-4">
            Contáctanos
          </h2>
          <div className="w-20 h-1 bg-spa-green mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Agenda tu cita o pregúntanos cualquier duda sobre nuestros servicios.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="font-playfair text-2xl font-semibold text-spa-dark mb-6">
                Información de Contacto
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-spa-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-spa-dark mb-1">Dirección</h4>
                    <p className="text-gray-600">CLL 28 #1 - 92, Quibdó, Chocó</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-spa-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-spa-dark mb-1">Teléfono</h4>
                    <p className="text-gray-600">(314) 627-1635</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-spa-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-spa-dark mb-1">Email</h4>
                    <p className="text-gray-600">info@purezadepiel.spa</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-spa-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-spa-dark mb-1">Horarios</h4>
                    <p className="text-gray-600">Lunes a Sábado: 9:00 AM - 7:00 PM</p>
                    <p className="text-gray-600">Domingo: Cerrado</p>
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="font-semibold text-spa-dark mb-4">Síguenos</h4>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="bg-spa-green text-white p-3 rounded-full hover:bg-spa-dark transition-colors duration-200"
                    data-testid="link-facebook"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a 
                    href="#" 
                    className="bg-spa-green text-white p-3 rounded-full hover:bg-spa-dark transition-colors duration-200"
                    data-testid="link-instagram"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a 
                    href="https://api.whatsapp.com/send?phone=573146271635"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-spa-green text-white p-3 rounded-full hover:bg-spa-dark transition-colors duration-200"
                    data-testid="link-whatsapp"
                  >
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="font-playfair text-2xl font-semibold text-spa-dark mb-6">
              Envíanos un Mensaje
            </h3>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-spa-dark font-medium mb-2">Nombre *</label>
                  <Input
                    {...form.register("name")}
                    placeholder="Tu nombre completo"
                    className="w-full"
                    data-testid="input-name"
                  />
                  {form.formState.errors.name && (
                    <span className="text-red-500 text-sm">
                      {form.formState.errors.name.message}
                    </span>
                  )}
                </div>
                
                <div>
                  <label className="block text-spa-dark font-medium mb-2">Teléfono *</label>
                  <Input
                    {...form.register("phone")}
                    placeholder="Tu número de teléfono"
                    className="w-full"
                    data-testid="input-phone"
                  />
                  {form.formState.errors.phone && (
                    <span className="text-red-500 text-sm">
                      {form.formState.errors.phone.message}
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-spa-dark font-medium mb-2">Email *</label>
                <Input
                  {...form.register("email")}
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full"
                  data-testid="input-email"
                />
                {form.formState.errors.email && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.email.message}
                  </span>
                )}
              </div>
              
              <div>
                <label className="block text-spa-dark font-medium mb-2">Servicio de Interés</label>
                <Select onValueChange={(value) => form.setValue("serviceInterest", value)}>
                  <SelectTrigger data-testid="select-service">
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facial">Tratamientos Faciales</SelectItem>
                    <SelectItem value="massage">Masajes Terapéuticos</SelectItem>
                    <SelectItem value="body">Tratamientos Corporales</SelectItem>
                    <SelectItem value="package">Paquetes Especiales</SelectItem>
                    <SelectItem value="consultation">Consulta General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-spa-dark font-medium mb-2">Mensaje *</label>
                <Textarea
                  {...form.register("message")}
                  rows={5}
                  placeholder="Cuéntanos sobre tus necesidades y expectativas..."
                  className="w-full resize-none"
                  data-testid="textarea-message"
                />
                {form.formState.errors.message && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.message.message}
                  </span>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-spa-green hover:bg-spa-dark text-white py-4 rounded-lg font-semibold"
                data-testid="button-submit-contact"
              >
                {mutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Enviando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Enviar Mensaje
                  </>
                )}
              </Button>
            </form>
            
            {/* Quick Booking Button */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">¿Prefieres reservar directamente?</p>
              <a 
                href="https://purezadepielspa.agendapro.com/co"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-spa-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-200"
                data-testid="link-book-online-contact"
              >
                <i className="fas fa-calendar-check mr-2"></i>
                Reservar Cita Online
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
