import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ContactMessagesManager() {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact-messages'],
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest("PATCH", `/api/contact-messages/${id}`, { status }),
    onSuccess: () => {
      toast({
        title: "Estado actualizado",
        description: "El estado del mensaje ha sido actualizado.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del mensaje.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/contact-messages/${id}`),
    onSuccess: () => {
      toast({
        title: "Mensaje eliminado",
        description: "El mensaje ha sido eliminado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
      setSelectedMessage(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el mensaje.",
        variant: "destructive",
      });
    },
  });

  const filteredMessages = messages.filter((message: ContactMessage) => 
    statusFilter === "all" || message.status === statusFilter
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      unread: "destructive",
      read: "secondary",
      responded: "default",
    };
    
    const labels = {
      unread: "No leído",
      read: "Leído",
      responded: "Respondido",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      updateStatusMutation.mutate({ id: message.id, status: 'read' });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este mensaje?")) {
      deleteMutation.mutate(id);
    }
  };

  const statusFilters = [
    { id: "all", label: "Todos" },
    { id: "unread", label: "No leídos" },
    { id: "read", label: "Leídos" },
    { id: "responded", label: "Respondidos" }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mensajes de Contacto</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mensajes de Contacto</h1>
        <div className="flex space-x-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter.id}
              size="sm"
              variant={statusFilter === filter.id ? "default" : "outline"}
              onClick={() => setStatusFilter(filter.id)}
              data-testid={`filter-${filter.id}`}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredMessages.map((message: ContactMessage) => (
          <Card 
            key={message.id} 
            className={`cursor-pointer transition-colors hover:bg-gray-50 ${
              message.status === 'unread' ? 'border-l-4 border-l-red-500' : ''
            }`}
            onClick={() => handleViewMessage(message)}
            data-testid={`message-${message.id}`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{message.name}</span>
                    {getStatusBadge(message.status!)}
                  </CardTitle>
                  <p className="text-gray-600">{message.email} • {message.phone}</p>
                  <p className="text-sm text-gray-500">{formatDate(message.createdAt!.toString())}</p>
                </div>
                {message.serviceInterest && (
                  <Badge variant="outline" className="capitalize">
                    {message.serviceInterest}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 line-clamp-2">{message.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {!filteredMessages.length && (
        <div className="text-center py-12">
          <i className="fas fa-envelope text-gray-400 text-6xl mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {statusFilter === "all" ? "No hay mensajes" : `No hay mensajes ${statusFilters.find(f => f.id === statusFilter)?.label.toLowerCase()}`}
          </h3>
          <p className="text-gray-500">
            {statusFilter === "all" 
              ? "Los nuevos mensajes aparecerán aquí."
              : "Cambia el filtro para ver otros mensajes."
            }
          </p>
        </div>
      )}

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Mensaje de {selectedMessage?.name}</span>
              {selectedMessage && getStatusBadge(selectedMessage.status!)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedMessage.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <p className="text-gray-900">{selectedMessage.phone}</p>
                </div>
              </div>
              
              {selectedMessage.serviceInterest && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Servicio de interés</label>
                  <p className="text-gray-900 capitalize">{selectedMessage.serviceInterest}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <p className="text-gray-900">{formatDate(selectedMessage.createdAt!.toString())}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => updateStatusMutation.mutate({
                      id: selectedMessage.id,
                      status: 'responded'
                    })}
                    disabled={updateStatusMutation.isPending}
                    data-testid="button-mark-responded"
                  >
                    <i className="fas fa-check mr-1"></i>
                    Marcar como Respondido
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: Consulta desde Pureza de Piel`)}
                    data-testid="button-reply-email"
                  >
                    <i className="fas fa-reply mr-1"></i>
                    Responder por Email
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(selectedMessage.name)}%2C%20gracias%20por%20contactarnos`)}
                    data-testid="button-reply-whatsapp"
                  >
                    <i className="fab fa-whatsapp mr-1"></i>
                    WhatsApp
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(selectedMessage.id)}
                  disabled={deleteMutation.isPending}
                  data-testid="button-delete-message"
                >
                  <i className="fas fa-trash mr-1"></i>
                  Eliminar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
