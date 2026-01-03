import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DashboardView } from "@/components/views/DashboardView";
import { FlightsView } from "@/components/views/FlightsView";
import { EventsView } from "@/components/views/EventsView";
import { LicensesView } from "@/components/views/LicensesView";
import { AlertsView } from "@/components/views/AlertsView";

const titles: Record<string, string> = {
  dashboard: "Dashboard",
  vuelos: "Vuelos Aeropuerto BCN",
  eventos: "Calendario de Eventos",
  licencias: "Precio de Licencias",
  alertas: "Alertas",
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pl-64">
        <Header title={titles[activeTab]} />
        
        <div className="p-6">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "vuelos" && <FlightsView />}
          {activeTab === "eventos" && <EventsView />}
          {activeTab === "licencias" && <LicensesView />}
          {activeTab === "alertas" && <AlertsView />}
        </div>
      </main>
    </div>
  );
};

export default Index;
