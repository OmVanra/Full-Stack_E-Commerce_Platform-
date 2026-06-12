-- Seed additional products so every category has at least 10 items.
-- Existing counts: Electronics 3, Accessories 2, Apparel 2, Home 3

-- ── Electronics (7 more → total 10) ──────────────────────────────────────
INSERT INTO public.products (name, description, price, stock_quantity, category, image_url) VALUES
('Bluetooth Speaker', 'Portable waterproof speaker with 360° surround sound and 12-hour battery.', 79.99, 50, 'Electronics', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'),
('USB-C Hub', '7-in-1 USB-C hub with HDMI, Ethernet, SD card reader, and USB 3.0 ports.', 54.99, 70, 'Electronics', 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800'),
('Wireless Mouse', 'Ergonomic silent-click mouse with adjustable DPI and dual-mode connectivity.', 39.99, 90, 'Electronics', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'),
('Noise-Cancelling Earbuds', 'True wireless earbuds with active noise cancellation and transparency mode.', 149.00, 35, 'Electronics', 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800'),
('Portable Charger', '20000mAh power bank with fast charging and LED display.', 44.99, 65, 'Electronics', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800'),
('Webcam HD', '1080p webcam with built-in ring light and auto-focus for streaming.', 69.00, 40, 'Electronics', 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800'),
('Tablet Stand', 'Adjustable aluminum stand for tablets and phones with cable management.', 34.99, 55, 'Electronics', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800');

-- ── Accessories (8 more → total 10) ──────────────────────────────────────
INSERT INTO public.products (name, description, price, stock_quantity, category, image_url) VALUES
('Sunglasses', 'Polarized UV400 aviator sunglasses with metal frame.', 65.00, 45, 'Accessories', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800'),
('Canvas Belt', 'Woven cotton canvas belt with brushed nickel buckle.', 28.00, 80, 'Accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a45?w=800'),
('Leather Watch Strap', 'Handmade Italian leather strap compatible with most 20mm watches.', 42.00, 55, 'Accessories', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800'),
('Wool Scarf', 'Soft merino wool scarf in herringbone pattern.', 55.00, 40, 'Accessories', 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800'),
('Baseball Cap', 'Embroidered cotton twill cap with adjustable strap.', 24.00, 100, 'Accessories', 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=800'),
('Crossbody Bag', 'Compact nylon crossbody bag with RFID-blocking pocket.', 68.00, 30, 'Accessories', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'),
('Beaded Bracelet', 'Natural stone beaded bracelet with adjustable cord.', 18.00, 120, 'Accessories', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'),
('Travel Organizer', 'Water-resistant tech organizer pouch for cables and accessories.', 32.00, 50, 'Accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800');

-- ── Apparel (8 more → total 10) ──────────────────────────────────────────
INSERT INTO public.products (name, description, price, stock_quantity, category, image_url) VALUES
('Linen Shirt', 'Breathable pure linen button-down shirt for warm weather.', 62.00, 50, 'Apparel', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'),
('Chino Pants', 'Slim-fit stretch chino pants in classic khaki.', 58.00, 45, 'Apparel', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'),
('Hoodie', 'Heavyweight French-terry hoodie with kangaroo pocket.', 74.00, 55, 'Apparel', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'),
('Running Shorts', 'Lightweight moisture-wicking shorts with built-in liner.', 38.00, 70, 'Apparel', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800'),
('Wool Sweater', 'Chunky-knit crew neck sweater in heather grey.', 95.00, 30, 'Apparel', 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a58?w=800'),
('Puffer Vest', 'Packable down puffer vest with water-resistant shell.', 110.00, 25, 'Apparel', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'),
('Polo Shirt', 'Piqué cotton polo with contrast collar and embroidered logo.', 48.00, 60, 'Apparel', 'https://images.unsplash.com/photo-1625910513413-5fc421e0fd9e?w=800'),
('Cargo Joggers', 'Relaxed-fit utility joggers with side cargo pockets.', 55.00, 40, 'Apparel', 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800');

-- ── Home (7 more → total 10) ─────────────────────────────────────────────
INSERT INTO public.products (name, description, price, stock_quantity, category, image_url) VALUES
('Indoor Plant Pot', 'Matte white ceramic planter with bamboo tray, 6-inch.', 22.00, 60, 'Home', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'),
('Throw Blanket', 'Ultra-soft chunky knit throw blanket, 50×60 inches.', 59.00, 35, 'Home', 'https://images.unsplash.com/photo-1580301762395-21ce12d4bc2b?w=800'),
('Wall Clock', 'Minimalist wooden wall clock with silent quartz movement.', 48.00, 40, 'Home', 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800'),
('Cutting Board Set', 'Set of 3 bamboo cutting boards with juice grooves.', 34.00, 55, 'Home', 'https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?w=800'),
('Linen Napkins', 'Set of 6 stone-washed linen dinner napkins.', 28.00, 70, 'Home', 'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=800'),
('Essential Oil Diffuser', 'Ultrasonic aroma diffuser with LED mood lighting, 300ml.', 36.00, 50, 'Home', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800'),
('Picture Frame Set', 'Gallery wall set of 5 wooden frames in assorted sizes.', 42.00, 45, 'Home', 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800');
