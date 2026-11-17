import React, { useEffect, useState } from 'react';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab, TURISTA_TABS } from './components/Sidebar';
import { LandingPortalView } from './components/LandingPortalView';
import { DashboardView } from './components/DashboardView';
import { CrudRestaurantes } from './components/CrudRestaurantes';
import { CrudClientes } from './components/CrudClientes';
import { CrudExperiencias } from './components/CrudExperiencias';
import { CrudOrdenes } from './components/CrudOrdenes';
import { ReportesView } from './components/ReportesView';
import { FacturaView } from './components/FacturaView';
import { Esquema30TablasView } from './components/Esquema30TablasView';
import { ReservaWizardView } from './components/ReservaWizardView';
import { LoginModal } from './components/LoginModal';

export const AppContent: React.FC = () => {
  const { user } = useDatabase();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // El turista entra directo a reservas y no puede abrir módulos administrativos.
  useEffect(() => {
    if (user?.rol === 'Turista' && !TURISTA_TABS.includes(activeTab)) setActiveTab('reserva_turista');
  }, [user, activeTab]);

  // GATED WELCOME PORTAL: If user is not logged in, show mandatory Landing Portal!
  if (!user) {
    return (
      <LandingPortalView
        onStartBookingAsGuest={() => {
          setActiveTab('reserva_turista');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100 font-sans">
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
          {activeTab === 'reserva_turista' && <ReservaWizardView />}
          {activeTab === 'restaurantes' && <CrudRestaurantes />}
          {activeTab === 'clientes' && <CrudClientes />}
          {activeTab === 'experiencias' && <CrudExperiencias />}
          {activeTab === 'ordenes' && <CrudOrdenes />}
          {activeTab === 'reportes' && <ReportesView />}
          {activeTab === 'factura' && <FacturaView />}
          {activeTab === 'modelo30' && <Esquema30TablasView />}
        </main>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <DatabaseProvider>
      <AppContent />
    </DatabaseProvider>
  );
};

export default App;
