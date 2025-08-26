import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import AppointmentsManager from "@/components/admin/appointments-manager";
import ServicesManager from "@/components/admin/services-manager";
import GalleryManager from "@/components/admin/gallery-manager";
import TestimonialsManager from "@/components/admin/testimonials-manager";
import ContactMessagesManager from "@/components/admin/contact-messages";
import PromotionsManager from "@/components/admin/promotions-manager";
import Login from "@/components/auth/login";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <Login onLoginSuccess={login} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "appointments":
        return <AppointmentsManager />;
      case "services":
        return <ServicesManager />;
      case "gallery":
        return <GalleryManager />;
      case "testimonials":
        return <TestimonialsManager />;
      case "messages":
        return <ContactMessagesManager />;
      case "promotions":
        return <PromotionsManager />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
}

function DashboardOverview() {
  const { data: appointments = [] } = useQuery({
    queryKey: ['/api/appointments'],
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['/api/contact-messages'],
  });

  const { data: newsletterSubscribers = [] } = useQuery({
    queryKey: ['/api/newsletter-subscribers'],
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['/api/testimonials'],
  });

  // Calculate stats
  const todayAppointments = appointments.filter((apt: any) => {
    const today = new Date().toDateString();
    return new Date(apt.appointmentDate).toDateString() === today;
  }).length;

  const newClients = appointments.filter((apt: any) => {
    const thisMonth = new Date();
    const aptDate = new Date(apt.createdAt);
    return aptDate.getMonth() === thisMonth.getMonth() && 
           aptDate.getFullYear() === thisMonth.getFullYear();
  }).length;

  const unreadMessages = messages.filter((msg: any) => msg.status === 'unread').length;
  const pendingTestimonials = testimonials.filter((test: any) => !test.approved).length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-primary text-primary-foreground p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="opacity-80">Citas Hoy</p>
              <p className="text-3xl font-bold" data-testid="stat-appointments-today">
                {todayAppointments}
              </p>
            </div>
            <i className="fas fa-calendar-day text-2xl opacity-80"></i>
          </div>
        </div>
        
        <div className="bg-secondary text-secondary-foreground p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="opacity-80">Nuevos Clientes</p>
              <p className="text-3xl font-bold" data-testid="stat-new-clients">
                {newClients}
              </p>
            </div>
            <i className="fas fa-user-plus text-2xl opacity-80"></i>
          </div>
        </div>
        
        <div className="bg-blue-500 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="opacity-80">Mensajes Sin Leer</p>
              <p className="text-3xl font-bold" data-testid="stat-unread-messages">
                {unreadMessages}
              </p>
            </div>
            <i className="fas fa-envelope text-2xl opacity-80"></i>
          </div>
        </div>
        
        <div className="bg-purple-500 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="opacity-80">Suscriptores</p>
              <p className="text-3xl font-bold" data-testid="stat-newsletter-subscribers">
                {newsletterSubscribers.length}
              </p>
            </div>
            <i className="fas fa-users text-2xl opacity-80"></i>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="font-semibold text-foreground mb-4">Acciones Rápidas</h3>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.href = '#appointments'}
              className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              data-testid="button-view-appointments"
            >
              <i className="fas fa-calendar mr-2 text-primary"></i>
              Ver Citas del Día ({todayAppointments})
            </button>
            <button 
              onClick={() => window.location.href = '#messages'}
              className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              data-testid="button-view-messages"
            >
              <i className="fas fa-envelope mr-2 text-primary"></i>
              Mensajes Sin Leer ({unreadMessages})
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="font-semibold text-foreground mb-4">Gestión de Contenido</h3>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.href = '#services'}
              className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              data-testid="button-manage-services"
            >
              <i className="fas fa-spa mr-2 text-primary"></i>
              Gestionar Servicios
            </button>
            <button 
              onClick={() => window.location.href = '#gallery'}
              className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              data-testid="button-manage-gallery"
            >
              <i className="fas fa-images mr-2 text-primary"></i>
              Gestionar Galería
            </button>
            <button 
              onClick={() => window.location.href = '#testimonials'}
              className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              data-testid="button-manage-testimonials"
            >
              <i className="fas fa-comments mr-2 text-primary"></i>
              Testimonios ({pendingTestimonials} pendientes)
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="font-semibold text-foreground mb-4">Marketing</h3>
          <div className="space-y-2">
            <button 
              className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              data-testid="button-newsletter-stats"
            >
              <i className="fas fa-chart-line mr-2 text-primary"></i>
              Suscriptores Newsletter ({newsletterSubscribers?.length || 0})
            </button>
            <button 
              className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              data-testid="button-view-analytics"
            >
              <i className="fas fa-chart-bar mr-2 text-primary"></i>
              Ver Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="font-semibold text-foreground mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          {messages?.slice(0, 5).map((message: any) => (
            <div key={message.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-primary"></i>
                <div>
                  <p className="font-medium text-foreground">{message.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                    {message.message}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(message.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
          {!messages?.length && (
            <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
          )}
        </div>
      </div>
    </div>
  );
}
