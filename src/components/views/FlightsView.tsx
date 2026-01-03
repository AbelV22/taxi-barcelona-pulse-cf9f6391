import { useState } from "react";
import { Plane, Clock, TrendingUp, ArrowRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";

const hourlyData = [
  { hour: "06:00", t1: 3, t2: 2, puente: 4, t2c: 1 },
  { hour: "08:00", t1: 5, t2: 3, puente: 6, t2c: 4 },
  { hour: "10:00", t1: 8, t2: 4, puente: 3, t2c: 6 },
  { hour: "12:00", t1: 6, t2: 5, puente: 5, t2c: 5 },
  { hour: "14:00", t1: 10, t2: 6, puente: 4, t2c: 8 },
  { hour: "16:00", t1: 9, t2: 4, puente: 3, t2c: 7 },
  { hour: "18:00", t1: 7, t2: 3, puente: 2, t2c: 5 },
  { hour: "20:00", t1: 5, t2: 2, puente: 1, t2c: 3 },
  { hour: "22:00", t1: 3, t2: 1, puente: 0, t2c: 2 },
];

const terminalDistribution = [
  { name: "T1", value: 47, color: "#3B82F6" },
  { name: "T2", value: 23, color: "#10B981" },
  { name: "Puente", value: 18, color: "#8B5CF6" },
  { name: "T2C", value: 31, color: "#F97316" },
];

const upcomingFlights = [
  { time: "14:30", origin: "Madrid", terminal: "T1", airline: "Iberia", flight: "IB1234" },
  { time: "14:45", origin: "London", terminal: "T1", airline: "British Airways", flight: "BA456" },
  { time: "15:00", origin: "Paris", terminal: "T2C", airline: "EasyJet", flight: "U2789" },
  { time: "15:15", origin: "Amsterdam", terminal: "T2", airline: "KLM", flight: "KL321" },
  { time: "15:30", origin: "Frankfurt", terminal: "T1", airline: "Lufthansa", flight: "LH654" },
];

const terminalColors: Record<string, string> = {
  T1: "bg-terminal-t1",
  T2: "bg-terminal-t2",
  "Puente": "bg-terminal-puente",
  T2C: "bg-terminal-t2c",
};

export function FlightsView() {
  const [selectedTerminal, setSelectedTerminal] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {terminalDistribution.map((terminal) => (
          <button
            key={terminal.name}
            onClick={() => setSelectedTerminal(
              selectedTerminal === terminal.name ? null : terminal.name
            )}
            className={cn(
              "card-dashboard p-4 text-left transition-all duration-200",
              selectedTerminal === terminal.name && "ring-2 ring-primary"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: terminal.color }}
              />
              <span className="text-sm text-muted-foreground">{terminal.name}</span>
            </div>
            <p className="stat-value text-foreground">{terminal.value}</p>
            <p className="text-xs text-muted-foreground">vuelos hoy</p>
          </button>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Hourly distribution */}
        <div className="lg:col-span-2 card-dashboard p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">
              Distribución por Horas
            </h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrar
            </Button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <XAxis 
                  dataKey="hour" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(220, 15%, 45%)' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(220, 15%, 45%)' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(220, 15%, 88%)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="t1" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="t2" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="puente" stackId="a" fill="#8B5CF6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="t2c" stackId="a" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Terminal distribution */}
        <div className="card-dashboard p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">
            Por Terminal
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={terminalDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {terminalDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Upcoming flights table */}
      <div className="card-dashboard p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-foreground">
            Próximas Llegadas
          </h3>
          <Badge variant="secondary" className="bg-success/10 text-success">
            <Clock className="h-3 w-3 mr-1" />
            En tiempo real
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">Hora</th>
                <th className="pb-3 font-medium">Vuelo</th>
                <th className="pb-3 font-medium">Origen</th>
                <th className="pb-3 font-medium">Aerolínea</th>
                <th className="pb-3 font-medium">Terminal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {upcomingFlights.map((flight, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3">
                    <span className="font-mono font-medium text-foreground">
                      {flight.time}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="font-medium text-foreground">{flight.flight}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {flight.origin}
                      <ArrowRight className="h-3 w-3" />
                      <span className="text-foreground">BCN</span>
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground">{flight.airline}</td>
                  <td className="py-3">
                    <Badge className={cn("text-white", terminalColors[flight.terminal])}>
                      {flight.terminal}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
