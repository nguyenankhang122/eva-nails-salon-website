-- Create gallery_images table to store nail design images
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable RLS on gallery_images table
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read gallery images
CREATE POLICY "Allow public to read gallery images"
ON gallery_images
FOR SELECT
USING (true);

-- Create policy to allow service role to manage gallery images
CREATE POLICY "Allow service role to manage gallery images"
ON gallery_images
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Insert sample gallery data
INSERT INTO gallery_images (title, description, image_url, category, display_order) VALUES
('Classic Red', 'Elegant classic red manicure with glossy finish', '/luxury-nail-design-.jpg?height=300&width=300&query=classic red nail design', 'Manicure', 1),
('Ombre Design', 'Beautiful gradient ombre nail art', '/luxury-nail-design-.jpg?height=300&width=300&query=ombre nail design', 'Nail Art', 2),
('French Tips', 'Timeless French manicure with white tips', '/luxury-nail-design-.jpg?height=300&width=300&query=french tips nail design', 'Manicure', 3),
('Glitter Accent', 'Sparkly glitter accent nails', '/luxury-nail-design-.jpg?height=300&width=300&query=glitter accent nail art', 'Nail Art', 4),
('Gel Extensions', 'Long gel nail extensions with glossy finish', '/luxury-nail-design-.jpg?height=300&width=300&query=gel extensions nail design', 'Extensions', 5),
('Marble Effect', 'Sophisticated marble pattern nail art', '/luxury-nail-design-.jpg?height=300&width=300&query=marble effect nail design', 'Nail Art', 6);
