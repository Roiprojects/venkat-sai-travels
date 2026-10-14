-- Admin Users table (primary table checked by auth_server.py)
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(50) DEFAULT 'authenticator',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Fallback admins table (secondary check in auth_server.py)
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'authenticator',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed: admin / admin  (bcrypt hash of "admin")
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
