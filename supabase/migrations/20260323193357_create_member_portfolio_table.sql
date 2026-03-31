CREATE TABLE member_portfolio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMETZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMETZ NOT NULL DEFAULT NOW(),
    first_name TEXT,
    middle_name TEXT,
    last_name TEXT,
    suffix TEXT,
    nickname TEXT,
    gdg_id TEXT UNIQUE,
    email TEXT UNIQUE,
    membership_type TEXT,
    department TEXT,
    year_level INTEGER,
    program TEXT,
    bio TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_website_url TEXT,
    other_links TEXT[],
    technical_skills TEXT[],
    learning_interests TEXT[],
    tools_and_technologies TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    profile_image TEXT
);

CREATE INDEX idx_member_portfolio_gdg_id ON member_portfolio(gdg_id);
CREATE INDEX idx_member_portfolio_email ON member_portfolio(email);
