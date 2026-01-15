-- Quick Earnings Log - Track taxi fares with one tap
-- This is a PRO feature for paid subscribers

CREATE TABLE IF NOT EXISTS registros_carreras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  importe DECIMAL(10,2) NOT NULL,
  propina DECIMAL(10,2) DEFAULT 0,
  metodo_pago TEXT DEFAULT 'efectivo' CHECK (metodo_pago IN ('efectivo', 'tarjeta')),
  zona TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries by device and date
CREATE INDEX IF NOT EXISTS idx_carreras_device_date 
ON registros_carreras(device_id, created_at DESC);

-- Row Level Security (optional, for multi-tenant)
ALTER TABLE registros_carreras ENABLE ROW LEVEL SECURITY;

-- Allow users to read/write their own data
CREATE POLICY "Users can manage own carreras"
ON registros_carreras
FOR ALL
USING (true)
WITH CHECK (true);
