-- Comments table for blog posts
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id VARCHAR(255) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Index for faster queries by post_id
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

-- Index for faster queries by created_at (for ordering)
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
