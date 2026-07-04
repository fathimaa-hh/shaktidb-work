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
CREATE TABLE problems (
    problem_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    platform_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    problem_url VARCHAR(255),

    CONSTRAINT fk_problem_platform
        FOREIGN KEY (platform_id)
        REFERENCES platforms(platform_id),

    CONSTRAINT fk_problem_topic
        FOREIGN KEY (topic_id)
        REFERENCES topics(topic_id),

    CONSTRAINT chk_difficulty
        CHECK (difficulty IN ('Easy', 'Medium', 'Hard'))
);
CREATE TABLE user_problem_history (
    history_id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    problem_id INTEGER NOT NULL,

    status VARCHAR(20) DEFAULT 'Solved',

    attempts INTEGER DEFAULT 1,

    time_taken INTEGER,

    language VARCHAR(50),

    notes TEXT,

    solved_date DATE,

    CONSTRAINT fk_history_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_history_problem
        FOREIGN KEY (problem_id)
        REFERENCES problems(problem_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_status
        CHECK (status IN ('Solved', 'Attempted'))
);
CREATE TABLE contests (
    contest_id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    platform_id INTEGER NOT NULL,

    contest_name VARCHAR(200) NOT NULL,

    rank INTEGER,

    score DECIMAL(6,2),

    contest_date DATE,

    CONSTRAINT fk_contest_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_contest_platform
        FOREIGN KEY (platform_id)
        REFERENCES platforms(platform_id)
);
CREATE TABLE daily_activity (
    activity_id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    practice_date DATE NOT NULL,

    coding_minutes INTEGER DEFAULT 0,

    problems_solved INTEGER DEFAULT 0,

    CONSTRAINT fk_activity_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);