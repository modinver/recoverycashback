-- TypingCenterNear.me — PostgreSQL Schema v2.0
-- Run this in Supabase Dashboard SQL Editor after self-hosted deployment

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: typing_centers
-- ============================================================
CREATE TABLE IF NOT EXISTS typing_centers (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text UNIQUE NOT NULL,
  name             text NOT NULL,
  emirate          text NOT NULL CHECK (emirate IN (
                     'dubai','abu-dhabi','sharjah','ajman',
                     'ras-al-khaimah','fujairah','umm-al-quwain')),
  address          text,
  phone            text,
  whatsapp         text,
  email            text,
  website          text,
  lat              decimal(10,8),
  lng              decimal(11,8),
  area             text,
  opening_hours    jsonb DEFAULT '{}',
  rating           decimal(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count     integer DEFAULT 0,
  price_range      text CHECK (price_range IN ('$','$$','$$$')),
  services         text[] DEFAULT '{}',
  photos           text[] DEFAULT '{}',
  description      text,
  meta_title       text,
  meta_description text,
  schema_extra     jsonb DEFAULT '{}',
  is_featured      boolean DEFAULT false,
  is_published     boolean DEFAULT true,
  import_source    text DEFAULT 'manual',
  ai_generated     boolean DEFAULT false,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_centers_emirate   ON typing_centers (emirate);
CREATE INDEX IF NOT EXISTS idx_centers_published ON typing_centers (is_published);
CREATE INDEX IF NOT EXISTS idx_centers_featured  ON typing_centers (is_featured);
CREATE INDEX IF NOT EXISTS idx_centers_slug      ON typing_centers (slug);
CREATE INDEX IF NOT EXISTS idx_centers_rating    ON typing_centers (rating DESC);

-- ============================================================
-- TABLE: blog_posts
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text UNIQUE NOT NULL,
  title            text NOT NULL,
  content          text,
  excerpt          text,
  featured_image   text,
  meta_title       text,
  meta_description text,
  schema_json      text,
  is_published     boolean DEFAULT false,
  ai_generated     boolean DEFAULT false,
  ai_prompt_used   text,
  published_at     timestamptz,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_slug      ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON blog_posts (is_published);
CREATE INDEX IF NOT EXISTS idx_posts_pub_date  ON blog_posts (published_at DESC);

-- ============================================================
-- TABLE: reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id   uuid REFERENCES typing_centers (id) ON DELETE CASCADE,
  author_name text,
  rating      integer CHECK (rating >= 1 AND rating <= 5),
  comment     text,
  source      text DEFAULT 'manual',
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_center ON reviews (center_id);

-- ============================================================
-- TABLE: ai_log
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text,
  entity_id   uuid,
  provider    text,
  model       text,
  tokens_in   integer DEFAULT 0,
  tokens_out  integer DEFAULT 0,
  prompt_used text,
  created_at  timestamptz DEFAULT now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE typing_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_log         ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read"       ON typing_centers;
DROP POLICY IF EXISTS "admin_write"       ON typing_centers;
DROP POLICY IF EXISTS "public_read_posts" ON blog_posts;
DROP POLICY IF EXISTS "admin_write_posts" ON blog_posts;
DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
DROP POLICY IF EXISTS "admin_write_reviews" ON reviews;
DROP POLICY IF EXISTS "admin_ai_log"      ON ai_log;

CREATE POLICY "public_read"         ON typing_centers FOR SELECT USING (is_published = true);
CREATE POLICY "admin_write"         ON typing_centers FOR ALL    USING (auth.role() = 'authenticated');
CREATE POLICY "public_read_posts"   ON blog_posts     FOR SELECT USING (is_published = true);
CREATE POLICY "admin_write_posts"   ON blog_posts     FOR ALL    USING (auth.role() = 'authenticated');
CREATE POLICY "public_read_reviews" ON reviews        FOR SELECT USING (true);
CREATE POLICY "admin_write_reviews" ON reviews        FOR ALL    USING (auth.role() = 'authenticated');
CREATE POLICY "admin_ai_log"        ON ai_log         FOR ALL    USING (auth.role() = 'authenticated');

-- ============================================================
-- Trigger: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_updated_at       ON typing_centers;
DROP TRIGGER IF EXISTS trg_updated_at_posts ON blog_posts;

CREATE TRIGGER trg_updated_at
  BEFORE UPDATE ON typing_centers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_updated_at_posts
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Trigger: auto-update center rating from reviews
-- ============================================================
CREATE OR REPLACE FUNCTION update_center_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE typing_centers
  SET
    rating       = (SELECT COALESCE(AVG(rating)::decimal(2,1), 0) FROM reviews WHERE center_id = COALESCE(NEW.center_id, OLD.center_id)),
    review_count = (SELECT COUNT(*) FROM reviews WHERE center_id = COALESCE(NEW.center_id, OLD.center_id))
  WHERE id = COALESCE(NEW.center_id, OLD.center_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_rating ON reviews;
CREATE TRIGGER trg_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_center_rating();

-- ============================================================
-- Sample data
-- ============================================================
INSERT INTO typing_centers (slug, name, emirate, address, phone, area, lat, lng, rating, review_count, services, is_featured, description, meta_title, meta_description)
VALUES
  ('al-masa-typing-dubai', 'Al Masa Typing Center', 'dubai',
   'Al Barsha, Sheikh Zayed Road, Dubai', '+971 4 555 0101', 'Al Barsha',
   25.1072, 55.1562, 4.5, 120,
   ARRAY['emirates-id','visa','ejari','dha-medical','tasheel'], true,
   'Al Masa Typing Center offers fast and reliable government document processing in Dubai including Emirates ID, visa typing, Ejari and DHA medical.',
   'Al Masa Typing Center Dubai — Emirates ID & Visa Services',
   'Al Masa Typing Center in Al Barsha Dubai. Emirates ID typing, visa applications, Ejari and DHA medical. Open 7 days.'),
  ('united-typing-deira', 'United Typing Center Deira', 'dubai',
   'Deira, Baniyas Road, Dubai', '+971 4 555 0202', 'Deira',
   25.2697, 55.3094, 4.2, 85,
   ARRAY['emirates-id','visa','tasheel','labour'], false,
   'United Typing Center in Deira provides comprehensive typing services for UAE residents.',
   'United Typing Center Deira Dubai — Government Services',
   'Professional typing services in Deira Dubai. Emirates ID, visa typing, Tasheel and labour card applications.'),
  ('capital-typing-abudhabi', 'Capital Typing Center', 'abu-dhabi',
   'Hamdan Street, Abu Dhabi', '+971 2 555 0303', 'Hamdan Street',
   24.4664, 54.3773, 4.6, 200,
   ARRAY['emirates-id','visa','ejari','adha'], true,
   'Capital Typing Center on Hamdan Street is a trusted provider of government typing services in Abu Dhabi.',
   'Capital Typing Center Abu Dhabi — Official Document Services',
   'Reliable typing center on Hamdan Street Abu Dhabi. Emirates ID, visa, Ejari and ADHA medical services.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (slug, title, excerpt, meta_title, meta_description, is_published, published_at)
VALUES
  ('how-to-renew-emirates-id-2024', 'How to Renew Your Emirates ID — Step by Step Guide',
   'Complete guide to renewing your Emirates ID in UAE. Documents required, fees and processing times.',
   'How to Renew Emirates ID 2024 — Complete Guide UAE',
   'Renew your Emirates ID in UAE step by step. Documents, fees, ICA portal, typing center costs and processing time.',
   true, now()),
  ('best-typing-centers-dubai', 'Best Typing Centers in Dubai — Top 10 Reviewed',
   'Find the best typing centers in Dubai rated by expats. Compare services, locations and prices.',
   'Best Typing Centers in Dubai 2024 — Top 10 List',
   'Top 10 typing centers in Dubai reviewed. Emirates ID, visa, Ejari services. Compare prices and locations.',
   true, now())
ON CONFLICT (slug) DO NOTHING;
