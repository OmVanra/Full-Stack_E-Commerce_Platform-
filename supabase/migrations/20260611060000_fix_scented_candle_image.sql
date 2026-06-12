-- Fix broken Scented Candle image URL
UPDATE public.products
SET image_url = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800'
WHERE name = 'Scented Candle'
  AND image_url = 'https://images.unsplash.com/photo-1602874801006-e26c4c5e3897?w=800';
