-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  full_set_price DECIMAL(10, 2),
  fill_ins_price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view services
CREATE POLICY "Allow public to view services" ON public.services
  FOR SELECT USING (true);

-- Create policy to allow admin to insert services (we'll use service role for admin operations)
CREATE POLICY "Allow service role to manage services" ON public.services
  FOR ALL USING (true);

-- Insert initial services data
INSERT INTO public.services (name, description, category, price) VALUES
('Basic Spa Pedicure', 'Nail trimming & shaping, cuticle care, exfoliation, hydrating lotion massage, regular polish', 'Pedicure', 35),
('Relax Spa Pedicure', 'Nail trimming & shaping, cuticle care, callus removal, exfoliation, hot stone massage, lotion massage, paraffin wax treatment, regular polish', 'Pedicure', 45),
('Collagen Spa Pedicure', 'Nail trimming & shaping, cuticle care, callus removal, exfoliation, hot stone massage, lotion massage, paraffin wax treatment, hot towel wrap, regular polish', 'Pedicure', 55),
('Deluxe Spa Pedicure', 'Nail trimming & shaping, cuticle care, callus removal, exfoliation, hot stone massage, extended lotion massage, paraffin wax treatment, hot towel wrap, regular polish', 'Pedicure', 65),
('Kid''s Pedicure', 'Nail trimming & shaping, cuticle care, exfoliation, hydrating lotion, regular polish, gel polish upgrade +$10', 'Pedicure', 25),
('Classic Manicure with Regular Polish', 'Classic manicure with regular polish', 'Manicure', 20),
('Gel Manicure', 'Gel manicure', 'Manicure', 35),
('Kid''s Manicure', 'Kid''s manicure with gel polish upgrade +$10', 'Manicure', 15),
('Polish Change with Trim & Shape', 'Polish change with trim & shape', 'Manicure', 10),
('Gel Polish Change with Trim & Shape', 'Gel polish change with trim & shape', 'Manicure', 20),
('Gel Polish', 'Gel polish full set or fill-ins', 'Nail Enhancement', 50),
('Color Powder', 'Color powder full set or fill-ins', 'Nail Enhancement', 50),
('Ombre', 'Ombre full set or fill-ins', 'Nail Enhancement', 65),
('Pink & White', 'Pink & white full set or fill-ins', 'Nail Enhancement', 60),
('White Tip', 'White tip full set or fill-ins', 'Nail Enhancement', 50),
('Regular Polish', 'Regular polish full set or fill-ins', 'Nail Enhancement', 40),
('Dip Color', 'Dip color', 'Dipping Powder', 50),
('Dip Ombre', 'Dip ombre', 'Dipping Powder', 65),
('Dip French', 'Dip french', 'Dipping Powder', 60),
('Eyebrows', 'Eyebrows waxing', 'Waxing', 10),
('Upper Lip', 'Upper lip waxing', 'Waxing', 7),
('Chin', 'Chin waxing', 'Waxing', 8),
('Underarm Wax', 'Underarm waxing', 'Waxing', 20),
('Full Face', 'Full face waxing', 'Waxing', 40),
('Arms', 'Arms waxing', 'Waxing', 40),
('Half Leg', 'Half leg waxing', 'Waxing', 40),
('Full Leg', 'Full leg waxing', 'Waxing', 80),
('Removal', 'Removal service', 'Additional Services', 5),
('Extra Design (Simple)', 'Extra simple design', 'Additional Services', 10),
('Chrome', 'Chrome service', 'Additional Services', 15),
('French (Classic)', 'French classic service', 'Additional Services', 5),
('French (Pink & White)', 'French pink & white service', 'Additional Services', 10),
('Cat Eye (Depending on Design)', 'Cat eye service depending on design', 'Additional Services', 10);
