-- Migration: Create access_codes table for Premium Calendar
-- Date: 2026-01-12

CREATE TABLE IF NOT EXISTS access_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_access_codes_code ON access_codes(code);

-- Enable RLS
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can check codes" ON access_codes
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage codes" ON access_codes
    FOR ALL USING (true) WITH CHECK (true);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_access_codes_updated_at ON access_codes;
CREATE TRIGGER update_access_codes_updated_at
    BEFORE UPDATE ON access_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Initial demo codes
INSERT INTO access_codes (code, description) VALUES
    ('PREMIUM2024', 'Mã mặc định năm 2024'),
    ('LICHVANSU', 'Mã mặc định dịch vụ'),
    ('MINHPHUOC', 'Mã thương hiệu')
ON CONFLICT (code) DO NOTHING;
