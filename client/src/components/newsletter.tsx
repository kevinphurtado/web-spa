import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNewsletterSubscriberSchema, type InsertNewsletterSubscriber } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  const { toast } = useToast();

  const form = useForm<InsertNewsletterSubscriber>({
    resolver: zodResolver(insertNewsletterSubscriberSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertNewsletterSubscriber) =>
      apiRequest("POST", "/api/newsletter-subscribers", data),
    onSuccess: () => {
      toast({
        title: "¡Suscripción exitosa!",
        description: "Te hemos suscrito a nuestro newsletter. Recibirás ofertas exclusivas y tips de belleza.",
      });
      form.reset();
    },
    onError: (error: any) => {
      const message = error.message?.includes("unique") 
        ? "Este email ya está suscrito a nuestro newsletter."
        : "No se pudo completar la suscripción. Inténtalo nuevamente.";
      
      toast({
        title: "Error en la suscripción",
        description: message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertNewsletterSubscriber) => {
    mutation.mutate(data);
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
            Mantente Conectada con tu Bienestar
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Recibe tips de belleza, ofertas exclusivas y noticias sobre nuestros nuevos tratamientos.
          </p>
          
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
          >
            <Input
              {...form.register("email")}
              type="email"
              placeholder="Tu email"
              className="flex-1 px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white bg-white"
              required
              data-testid="input-newsletter-email"
            />
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-secondary text-secondary-foreground px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors duration-200"
              data-testid="button-subscribe-newsletter"
            >
              {mutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Suscribiendo...
                </>
              ) : (
                "Suscribirse"
              )}
            </Button>
          </form>
          
          {form.formState.errors.email && (
            <p className="text-red-300 text-sm mt-2">
              {form.formState.errors.email.message}
            </p>
          )}
          
          <p className="text-sm opacity-75 mt-4">
            * No enviamos spam. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      </div>
    </section>
  );
}
