-- Add exited_at column to track when drivers leave a zone
ALTER TABLE public.registros_reten 
ADD COLUMN IF NOT EXISTS exited_at TIMESTAMPTZ NULL;

-- Create index for faster queries on active drivers
CREATE INDEX IF NOT EXISTS idx_registros_reten_exited_at 
ON public.registros_reten(exited_at) WHERE exited_at IS NULL;

-- Comment for documentation
COMMENT ON COLUMN public.registros_reten.exited_at IS 'Timestamp when the driver exited the zone (NULL = still in zone)';
