import { TrendingUp, TrendingDown, Info, ExternalLink } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { cn } from "@/lib/utils";

// Mock data - we'll start collecting from today
const priceHistory = [
  { date: "01/01", price: 152000 },
  { date: "02/01", price: 151500 },
  { date: "03/01", price: 153000 },
  { date: "Hoy", price: 152500 },
];

const currentPrice = 152500;
const previousPrice = 153000;
const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
const isUp = priceChange > 0;

const recentListings = [
  { source: "Milanuncios", price: 155000, includesCar: true, carValue: 8000 },
  { source: "Wallapop", price: 148000, includesCar: false, carValue: 0 },
  { source: "Idealista", price: 160000, includesCar: true, carValue: 12000 },
];

export function LicensePriceWidget({ expanded = false }: { expanded?: boolean }) {
  return (
    <div className="card-dashboard p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Precio Licencia</h3>
            <p className="text-sm text-muted-foreground">Mediana del mercado</p>
          </div>
        </div>
      </div>

      {/* Current price */}
      <div className="flex items-baseline gap-3 mb-4">
        <p className="stat-value text-foreground">
          {currentPrice.toLocaleString('es-ES')}€
        </p>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
          isUp ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}>
          {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{Math.abs(priceChange).toFixed(1)}%</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-32 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={priceHistory}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(45, 100%, 50%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(45, 100%, 50%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(220, 15%, 45%)' }}
            />
            <YAxis 
              hide 
              domain={['dataMin - 2000', 'dataMax + 2000']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(220, 15%, 88%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`${value.toLocaleString('es-ES')}€`, 'Precio']}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="hsl(45, 100%, 50%)" 
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Info notice */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-muted-foreground">
          Empezamos a recopilar datos hoy. El histórico se irá completando automáticamente.
        </p>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold mb-3">Últimos anuncios detectados</h4>
          <div className="space-y-2">
            {recentListings.map((listing, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{listing.source}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {listing.price.toLocaleString('es-ES')}€
                  </p>
                  {listing.includesCar && (
                    <p className="text-xs text-muted-foreground">
                      -coche ({listing.carValue.toLocaleString('es-ES')}€)
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
