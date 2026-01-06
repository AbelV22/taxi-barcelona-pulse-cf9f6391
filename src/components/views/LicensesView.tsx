import { TrendingUp, TrendingDown, ExternalLink, RefreshCw, Info, AlertCircle, Car, Tag, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Mock historical data - starts from "today"
const priceHistory = [{
  date: "01/01/26",
  price: 152000,
  listings: 5
}, {
  date: "02/01/26",
  price: 151500,
  listings: 4
}, {
  date: "03/01/26",
  price: 153000,
  listings: 6
}];

const currentStats = {
  median: 152500,
  average: 154200,
  min: 145000,
  max: 165000,
  change: -0.3,
  totalListings: 12
};

const listings = [{
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
}, {
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
}, {
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
}, {
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
}, {
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
}];

export function LicensesView() {
  return (
    <div className="space-y-4 animate-fade-in pb-20">
      {/* Stats cards - Diseño armonizado con dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
        <div className="card-dashboard p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Tag className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Mediana</span>
          </div>
          <p className="font-display font-bold text-xl md:text-2xl text-primary">
            {currentStats.median.toLocaleString('es-ES')}€
          </p>
          <div className={cn(
            "flex items-center gap-1 mt-1 text-xs",
            currentStats.change < 0 ? "text-destructive" : "text-success"
          )}>
            {currentStats.change < 0 ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <TrendingUp className="h-3 w-3" />
            )}
            <span>{Math.abs(currentStats.change)}% vs ayer</span>
          </div>
        </div>

        <div className="card-dashboard p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
              <TrendingDown className="h-4 w-4 text-success" />
            </div>
            <span className="text-xs text-muted-foreground">Mínimo</span>
          </div>
          <p className="font-display font-bold text-xl md:text-2xl text-success">
            {currentStats.min.toLocaleString('es-ES')}€
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">sin vehículo</p>
        </div>

        <div className="card-dashboard p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
              <TrendingUp className="h-4 w-4 text-destructive" />
            </div>
            <span className="text-xs text-muted-foreground">Máximo</span>
          </div>
          <p className="font-display font-bold text-xl md:text-2xl text-destructive">
            {currentStats.max.toLocaleString('es-ES')}€
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">con vehículo</p>
        </div>

        <div className="card-dashboard p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10">
              <BarChart3 className="h-4 w-4 text-info" />
            </div>
            <span className="text-xs text-muted-foreground">Anuncios</span>
          </div>
          <p className="font-display font-bold text-xl md:text-2xl text-info">
            {currentStats.totalListings}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">en 5 portales</p>
        </div>
      </div>

      {/* Chart - Estilo consistente */}
      <div className="card-dashboard p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div>
            <h3 className="font-display font-semibold text-foreground text-sm">Evolución del Precio</h3>
            <p className="text-[10px] text-muted-foreground">Mediana calculada de anuncios web</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 w-fit text-xs h-8">
            <RefreshCw className="h-3 w-3" />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
        </div>

        <div className="h-40 md:h-56 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceHistory}>
              <defs>
                <linearGradient id="priceGradientFull" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
                tickFormatter={value => `${(value / 1000).toFixed(0)}k€`} 
                domain={['dataMin - 5000', 'dataMax + 5000']} 
                width={45} 
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                  fontSize: '12px'
                }} 
                formatter={(value: number) => [`${value.toLocaleString('es-ES')}€`, 'Mediana']} 
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2} 
                fill="url(#priceGradientFull)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-info/10 text-[10px]">
          <Info className="h-3 w-3 text-info mt-0.5 flex-shrink-0" />
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Nuevo sistema:</span> Empezamos a recopilar datos el 01/01/2026.
          </p>
        </div>
      </div>

      {/* Listings - Diseño mobile-first mejorado */}
      <div className="card-dashboard p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-foreground text-sm">Anuncios Detectados</h3>
          <Badge variant="secondary" className="text-[10px] px-2 py-0.5">{listings.length} anuncios</Badge>
        </div>

        {/* Mobile cards - Diseño compacto */}
        <div className="md:hidden space-y-2">
          {listings.map(listing => (
            <div key={listing.id} className="p-3 rounded-lg bg-accent/30 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-display font-medium text-foreground text-sm">{listing.source}</span>
                  {listing.verified && (
                    <span className="text-[10px] text-success">✓</span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">{listing.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-muted-foreground">
                    Precio: {listing.price.toLocaleString('es-ES')}€
                  </p>
                  {listing.includesCar && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Car className="h-3 w-3" />
                      <span>{listing.carModel} (-{listing.carValue.toLocaleString('es-ES')}€)</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-display font-bold text-primary text-lg">
                    {listing.netPrice.toLocaleString('es-ES')}€
                  </span>
                  <p className="text-[10px] text-muted-foreground">neto</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table - Estilo consistente */}
        <div className="hidden md:block overflow-x-auto scrollbar-dark">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="pb-2 font-medium">Fuente</th>
                <th className="pb-2 font-medium">Precio Total</th>
                <th className="pb-2 font-medium">Coche Incluido</th>
                <th className="pb-2 font-medium">Precio Neto</th>
                <th className="pb-2 font-medium">Fecha</th>
                <th className="pb-2 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {listings.map(listing => (
                <tr key={listing.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-medium text-foreground text-sm">{listing.source}</span>
                      {listing.verified && (
                        <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30 px-1.5 py-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 font-display font-medium text-foreground text-sm">
                    {listing.price.toLocaleString('es-ES')}€
                  </td>
                  <td className="py-2.5">
                    {listing.includesCar ? (
                      <div className="flex items-center gap-1.5">
                        <Car className="h-3.5 w-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-foreground">{listing.carModel}</p>
                          <p className="text-[10px] text-muted-foreground">
                            -{listing.carValue.toLocaleString('es-ES')}€
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-2.5">
                    <span className="font-display font-bold text-primary text-sm">
                      {listing.netPrice.toLocaleString('es-ES')}€
                    </span>
                  </td>
                  <td className="py-2.5 text-xs text-muted-foreground">
                    {listing.date}
                  </td>
                  <td className="py-2.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                      <a href={listing.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology note - Compacto */}
      <div className="card-dashboard p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-display font-semibold text-foreground text-xs mb-0.5">Metodología</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Escaneamos diariamente Milanuncios, Wallapop, Idealista y otros. 
              Si incluye vehículo, estimamos su valor y lo restamos del precio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}