import { TrendingUp, TrendingDown, ExternalLink, RefreshCw, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";

// Mock historical data - starts from "today"
const priceHistory = [
  { date: "01/01/26", price: 152000, listings: 5 },
  { date: "02/01/26", price: 151500, listings: 4 },
  { date: "03/01/26", price: 153000, listings: 6 },
];

const currentStats = {
  median: 152500,
  average: 154200,
  min: 145000,
  max: 165000,
  change: -0.3,
  totalListings: 12
};

const listings = [
  { 
    id: "1",
    source: "Milanuncios",
    url: "https://milanuncios.com",
    price: 155000, 
    includesCar: true, 
    carModel: "Toyota Prius 2022",
    carValue: 8000,
    netPrice: 147000,
    date: "Hoy",
    verified: true
  },
  { 
    id: "2",
    source: "Wallapop",
    url: "https://wallapop.com",
    price: 148000, 
    includesCar: false, 
    carModel: null,
    carValue: 0,
    netPrice: 148000,
    date: "Hoy",
    verified: true
  },
  { 
    id: "3",
    source: "Idealista",
    url: "https://idealista.com",
    price: 160000, 
    includesCar: true, 
    carModel: "Skoda Octavia 2021",
    carValue: 12000,
    netPrice: 148000,
    date: "Ayer",
    verified: false
  },
  { 
    id: "4",
    source: "Mil Anuncios Pro",
    url: "https://milanuncios.com",
    price: 165000, 
    includesCar: true, 
    carModel: "Mercedes Clase E 2023",
    carValue: 18000,
    netPrice: 147000,
    date: "Ayer",
    verified: true
  },
  { 
    id: "5",
    source: "Coches.net",
    url: "https://coches.net",
    price: 145000, 
    includesCar: false, 
    carModel: null,
    carValue: 0,
    netPrice: 145000,
    date: "Hace 2 días",
    verified: true
  },
];

export function LicensesView() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-dashboard p-4">
          <p className="text-sm text-muted-foreground mb-1">Mediana</p>
          <p className="stat-value text-primary">{currentStats.median.toLocaleString('es-ES')}€</p>
          <div className={cn(
            "flex items-center gap-1 mt-1 text-sm",
            currentStats.change < 0 ? "text-destructive" : "text-success"
          )}>
            {currentStats.change < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
            <span>{Math.abs(currentStats.change)}% vs ayer</span>
          </div>
        </div>

        <div className="card-dashboard p-4">
          <p className="text-sm text-muted-foreground mb-1">Precio Mínimo</p>
          <p className="stat-value text-success">{currentStats.min.toLocaleString('es-ES')}€</p>
          <p className="text-xs text-muted-foreground mt-1">sin vehículo incluido</p>
        </div>

        <div className="card-dashboard p-4">
          <p className="text-sm text-muted-foreground mb-1">Precio Máximo</p>
          <p className="stat-value text-destructive">{currentStats.max.toLocaleString('es-ES')}€</p>
          <p className="text-xs text-muted-foreground mt-1">con vehículo premium</p>
        </div>

        <div className="card-dashboard p-4">
          <p className="text-sm text-muted-foreground mb-1">Anuncios Activos</p>
          <p className="stat-value text-info">{currentStats.totalListings}</p>
          <p className="text-xs text-muted-foreground mt-1">en 5 portales</p>
        </div>
      </div>

      {/* Chart */}
      <div className="card-dashboard p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-foreground">Evolución del Precio</h3>
            <p className="text-sm text-muted-foreground">Mediana calculada a partir de anuncios web</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar datos
          </Button>
        </div>

        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceHistory}>
              <defs>
                <linearGradient id="priceGradientFull" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(45, 100%, 50%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(45, 100%, 50%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(220, 15%, 45%)' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(220, 15%, 45%)' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                domain={['dataMin - 5000', 'dataMax + 5000']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(220, 15%, 88%)',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value.toLocaleString('es-ES')}€`, 'Mediana']}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(45, 100%, 50%)" 
                strokeWidth={2}
                fill="url(#priceGradientFull)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-info/10 text-sm">
          <Info className="h-4 w-4 text-info mt-0.5 flex-shrink-0" />
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Nuevo sistema de seguimiento:</span> Empezamos a recopilar datos el 01/01/2026. 
            El gráfico se irá enriqueciendo automáticamente con datos diarios.
          </p>
        </div>
      </div>

      {/* Listings table */}
      <div className="card-dashboard p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-foreground">Anuncios Detectados</h3>
          <Badge variant="secondary">{listings.length} anuncios</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">Fuente</th>
                <th className="pb-3 font-medium">Precio Total</th>
                <th className="pb-3 font-medium">Coche Incluido</th>
                <th className="pb-3 font-medium">Precio Neto</th>
                <th className="pb-3 font-medium">Fecha</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{listing.source}</span>
                      {listing.verified && (
                        <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                          Verificado
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-3 font-medium text-foreground">
                    {listing.price.toLocaleString('es-ES')}€
                  </td>
                  <td className="py-3">
                    {listing.includesCar ? (
                      <div>
                        <p className="text-sm text-foreground">{listing.carModel}</p>
                        <p className="text-xs text-muted-foreground">
                          -{listing.carValue.toLocaleString('es-ES')}€ estimado
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-primary">
                      {listing.netPrice.toLocaleString('es-ES')}€
                    </span>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    {listing.date}
                  </td>
                  <td className="py-3">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={listing.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology note */}
      <div className="card-dashboard p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground mb-1">Metodología de cálculo</h4>
            <p className="text-sm text-muted-foreground">
              Escaneamos diariamente portales como Milanuncios, Wallapop, Idealista y otros. 
              Cuando un anuncio incluye vehículo, estimamos su valor de mercado y lo restamos del precio total. 
              La mediana se calcula sobre los precios netos de licencia (sin coche).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
