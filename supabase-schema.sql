-- ===========================================
-- OFFBEAT - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Emergency Requests table
CREATE TABLE public.emergency_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_by TEXT,
  raw_content TEXT,
  image_url TEXT,
  category TEXT CHECK (category IN ('blood', 'oxygen', 'shelter', 'medicine', 'rescue', 'other')),
  urgency_score INT CHECK (urgency_score BETWEEN 1 AND 5),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'verifying', 'in_progress', 'resolved', 'duplicate', 'expired')),
  structured_data JSONB,
  contact_info JSONB,
  location_data JSONB,
  verification_flags TEXT[],
  assigned_to TEXT,
  resolved_at TIMESTAMPTZ
);

-- Enable Realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE emergency_requests;

-- Enable Row Level Security
ALTER TABLE public.emergency_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (for the dashboard)
CREATE POLICY "Anyone can view emergency requests"
  ON emergency_requests FOR SELECT
  USING (true);

-- Allow anyone to insert (for submitting emergencies)
CREATE POLICY "Anyone can insert emergency requests"
  ON emergency_requests FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update (for taking charge / resolving)
CREATE POLICY "Anyone can update emergency requests"
  ON emergency_requests FOR UPDATE
  USING (true);

-- Create indexes for common queries
CREATE INDEX idx_emergency_requests_status ON emergency_requests(status);
CREATE INDEX idx_emergency_requests_category ON emergency_requests(category);
CREATE INDEX idx_emergency_requests_urgency ON emergency_requests(urgency_score DESC);
CREATE INDEX idx_emergency_requests_created ON emergency_requests(created_at DESC);

-- Create a storage bucket for emergency images
-- (Run this separately or create via Supabase Dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('emergency-images', 'emergency-images', true);
