-- =====================================================
-- Project : CodeQuest
-- Database: ShaktiDB
-- Author  : Fathima
-- Purpose : Database Schema for Coding Progress and
--           Skill Analytics Platform
-- =====================================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE platforms (
    platform_id SERIAL PRIMARY KEY,
    platform_name VARCHAR(100) UNIQUE NOT NULL,
    website VARCHAR(255)
);
CREATE TABLE topics (
    topic_id SERIAL PRIMARY KEY,
    topic_name VARCHAR(100) UNIQUE NOT NULL
);