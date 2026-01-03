import { HeroSection } from "@/components/widgets/HeroSection";
import { QuickStats } from "@/components/widgets/QuickStats";
import { FlightsWidget } from "@/components/widgets/FlightsWidget";
import { EventsWidget } from "@/components/widgets/EventsWidget";
import { LicensePriceWidget } from "@/components/widgets/LicensePriceWidget";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";

interface DashboardViewProps {
  onTerminalClick?: (terminalId: string) => void;
  onViewAllFlights?: () => void;
  onViewAllEvents?: () => void;
}

export function DashboardView({ onTerminalClick, onViewAllFlights, onViewAllEvents }: DashboardViewProps) {
  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* Hero Section - Brand entry */}
      <HeroSection />

      {/* Quick Stats - Most important first */}
      <QuickStats onViewAllFlights={onViewAllFlights} onViewAllEvents={onViewAllEvents} />

      {/* Flights widget - Full width for prominence */}
      <FlightsWidget 
        onTerminalClick={onTerminalClick}
        onViewAllClick={onViewAllFlights}
      />

      {/* Secondary widgets grid */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <EventsWidget onViewAllClick={onViewAllEvents} />
        <LicensePriceWidget />
      </div>

      {/* Weather - Less prominent at bottom */}
      <WeatherWidget />
    </div>
  );
}
