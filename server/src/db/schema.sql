-- =========================================================================
-- India Temple Heritage & Pilgrimage Information Portal (Bharat Teerth)
-- PostgreSQL Database Schema
-- Technology Stack: PostgreSQL 14+ with JSONB & Full-Text Search
-- =========================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Admin & Cultural Editors)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'SUPER_ADMIN',
    full_name VARCHAR(255),
    designation VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Temples Table
CREATE TABLE IF NOT EXISTS temples (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(120) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    local_name VARCHAR(255),
    regional_script VARCHAR(255),
    featured BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(50) DEFAULT 'verified',
    verified_by VARCHAR(255),
    image_url TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    
    -- Extracted search-optimized columns
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(150),
    region VARCHAR(50),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    elevation_meters INTEGER,
    
    primary_deity VARCHAR(255) NOT NULL,
    architectural_style VARCHAR(150),
    
    -- Structured JSONB documents for comprehensive heritage attributes
    location JSONB NOT NULL,
    deity JSONB NOT NULL,
    history JSONB NOT NULL,
    darshan_timings JSONB NOT NULL,
    festivals JSONB DEFAULT '[]'::jsonb,
    visitor_guidelines JSONB NOT NULL,
    nearby_facilities JSONB NOT NULL,
    circuits JSONB DEFAULT '[]'::jsonb,
    themes JSONB DEFAULT '[]'::jsonb,
    contact_info JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create fast query indexes on temples
CREATE INDEX IF NOT EXISTS idx_temples_slug ON temples(slug);
CREATE INDEX IF NOT EXISTS idx_temples_state ON temples(state);
CREATE INDEX IF NOT EXISTS idx_temples_city ON temples(city);
CREATE INDEX IF NOT EXISTS idx_temples_primary_deity ON temples(primary_deity);
CREATE INDEX IF NOT EXISTS idx_temples_region ON temples(region);
CREATE INDEX IF NOT EXISTS idx_temples_arch_style ON temples(architectural_style);
CREATE INDEX IF NOT EXISTS idx_temples_featured ON temples(featured);
CREATE INDEX IF NOT EXISTS idx_temples_coords ON temples(lat, lng);
CREATE INDEX IF NOT EXISTS idx_temples_circuits ON temples USING GIN (circuits);
CREATE INDEX IF NOT EXISTS idx_temples_themes ON temples USING GIN (themes);

-- Full-Text Search index for temple names, state, deity, and history
CREATE INDEX IF NOT EXISTS idx_temples_search ON temples USING GIN (
    to_tsvector('english', name || ' ' || COALESCE(local_name, '') || ' ' || state || ' ' || city || ' ' || primary_deity)
);

-- 3. Pilgrimage Circuits Table
CREATE TABLE IF NOT EXISTS circuits (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sanskrit_name VARCHAR(255),
    overview TEXT NOT NULL,
    deity VARCHAR(255),
    total_stops INTEGER NOT NULL,
    duration_days VARCHAR(100),
    best_season VARCHAR(255),
    key_stops JSONB NOT NULL DEFAULT '[]'::jsonb,
    tag VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_circuits_tag ON circuits(tag);

-- 4. Devotee Reviews & Verified Pilgrim Tips
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(100) PRIMARY KEY,
    temple_id VARCHAR(100) NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
    author VARCHAR(150) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    visit_date VARCHAR(50),
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'approved',
    date VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_temple_id ON reviews(temple_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);

