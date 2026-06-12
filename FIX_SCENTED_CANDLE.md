# How to Fix the Scented Candle Image

## Problem

The Scented Candle product has a broken image URL in the database.

## Solution

The migration file `supabase/migrations/20260611060000_fix_scented_candle_image.sql` already exists to fix this. The migration will update the image URL from:

- `https://images.unsplash.com/photo-1602874801006-e26c4c5e3897?w=800` (broken)

to:

- `https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800` (working)

## Steps to Apply the Fix

### Option 1: Using the Supabase Dashboard (Easiest)

1. Go to https://supabase.com/dashboard
2. Sign in with your account
3. Open project `yuxqmollcavrbhtrwwhg`
4. Click on "SQL Editor" in the left sidebar
5. Click "New Query"
6. Copy and paste the SQL from `supabase/migrations/20260611060000_fix_scented_candle_image.sql`:
   ```sql
   UPDATE public.products
   SET image_url = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800'
   WHERE name = 'Scented Candle'
     AND image_url = 'https://images.unsplash.com/photo-1602874801006-e26c4c5e3897?w=800';
   ```
7. Click "Run" button
8. The image should update immediately

### Option 2: Using Environment Variables

Add the service role key to your `.env` file:

1. Get your `SUPABASE_SERVICE_ROLE_KEY` from Supabase:
   - Go to https://supabase.com/dashboard
   - Open project `yuxqmollcavrbhtrwwhg`
   - Click on "Settings" → "API"
   - Copy the "service_role" key (marked as secret)

2. Add it to your `.env` file:

   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. Restart your dev server (`npm run dev`)

4. The fix will be applied automatically when the server starts

## After the Fix

- Reload the app at http://localhost:8080
- The Scented Candle product should now display with a proper image
- No action needed; the product will fetch the updated image from the database
