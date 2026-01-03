import { QuickStats } from "@/components/widgets/QuickStats";
import { FlightsWidget } from "@/components/widgets/FlightsWidget";
import { EventsWidget } from "@/components/widgets/EventsWidget";
import { LicensePriceWidget } from "@/components/widgets/LicensePriceWidget";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";

export function DashboardView() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quick Stats */}
      <QuickStats />

      {/* Main widgets grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <FlightsWidget />
        <EventsWidget />
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <LicensePriceWidget />
        <WeatherWidget />
      </div>
    </div>
  );
}
