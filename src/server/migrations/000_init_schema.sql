-- Initial Database Schema for Venkat Sai Travels

-- 1. Admin users (primary auth)
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(50) DEFAULT 'authenticator',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fallback admins table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'authenticator',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial admin: admin / admin (bcrypt hash)
INSERT INTO admin_users (username, password_hash, is_active, role)
VALUES (
    'admin',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeQvJQfH3qLxH6K',
    TRUE,
    'authenticator'
) ON CONFLICT (username) DO NOTHING;

INSERT INTO admins (username, password_hash, role)
VALUES (
    'admin',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeQvJQfH3qLxH6K'
) ON CONFLICT (username) DO NOTHING;

-- 2. Fleets
CREATE TABLE IF NOT EXISTS fleets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    seats INTEGER NOT NULL DEFAULT 4,
    fuel VARCHAR(50) DEFAULT 'Diesel',
    ac BOOLEAN DEFAULT TRUE,
    features JSONB DEFAULT '[]'::jsonb,
    image TEXT,
    color VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Services
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    icon VARCHAR(50),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    vehicles JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(150),
    rating INTEGER DEFAULT 5,
    text TEXT NOT NULL,
    date VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. FAQs
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Gallery
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    src TEXT NOT NULL,
    title VARCHAR(200),
    category VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Destinations
CREATE TABLE IF NOT EXISTS destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    distance VARCHAR(50),
    time VARCHAR(50),
    tag VARCHAR(100),
    gradient VARCHAR(100),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Blogs
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    tag VARCHAR(100),
    title VARCHAR(250) NOT NULL,
    excerpt TEXT,
    read_time VARCHAR(50),
    date VARCHAR(100),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Awards
CREATE TABLE IF NOT EXISTS awards (
    id SERIAL PRIMARY KEY,
    year VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Vehicle Availability
CREATE TABLE IF NOT EXISTS vehicle_availability (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(150) NOT NULL,
    seats INTEGER DEFAULT 4,
    available BOOLEAN DEFAULT TRUE,
    status VARCHAR(100) DEFAULT 'Available Now',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Safety Features
CREATE TABLE IF NOT EXISTS safety_features (
    id SERIAL PRIMARY KEY,
    icon VARCHAR(50),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Trusted By
CREATE TABLE IF NOT EXISTS trusted_by (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Settings (Key-Value)
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. About Content
CREATE TABLE IF NOT EXISTS about_founder (
    id SERIAL PRIMARY KEY,
    quote TEXT,
    title VARCHAR(200),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS about_timeline (
    id SERIAL PRIMARY KEY,
    year VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS about_values (
    id SERIAL PRIMARY KEY,
    icon VARCHAR(50),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Stats
CREATE TABLE IF NOT EXISTS stats (
    id SERIAL PRIMARY KEY,
    label VARCHAR(150) NOT NULL,
    value INTEGER NOT NULL,
    suffix VARCHAR(20) DEFAULT '+',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Bookings (Customer Submissions)
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    trip_type VARCHAR(100),
    vehicle VARCHAR(100),
    date VARCHAR(50),
    time VARCHAR(50),
    pickup TEXT,
    drop TEXT,
    passengers VARCHAR(20),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. Contact Inquiries
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. Companies & Inquiries & Vehicles
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    tagline VARCHAR(200),
    phone VARCHAR(50),
    email VARCHAR(150),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
