CREATE TABLE community_members (
    id UUID PRIMARY KEY,
    community_id UUID REFERENCES communities (id),
    user_id UUID REFERENCES users (id),
    role VARCHAR(20) DEFAULT 'member', -- 'creator', 'admin', 'member'
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (community_id, user_id)
)