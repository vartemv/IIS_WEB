-- Users Table
CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    profile_name VARCHAR(50) UNIQUE NOT NULL,
    sign_up_date DATE NOT NULL,
    hash_password VARCHAR(255) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('Admin', 'Mod', 'Rep', 'User')) DEFAULT 'User'
);

-- Posts Table
CREATE TABLE posts (
    ID SERIAL PRIMARY KEY,
    user_ID INT NOT NULL,
    datetime TIMESTAMP NOT NULL,
    mediafile VARCHAR(255),
    description TEXT,
    location VARCHAR(255),
    availability BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_ID) REFERENCES users(ID) ON DELETE CASCADE
);

-- Groups Table
CREATE TABLE groups (
    group_name VARCHAR(100) PRIMARY KEY NOT NULL,
    pocet INT DEFAULT 0,
    datum DATE NOT NULL
);

-- User_Group Table (Many-to-Many: Users and Groups)
CREATE TABLE user_groups (
    id_of_user INT NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('Active', 'Pending', 'Banned')) DEFAULT 'Active',
    datum DATE NOT NULL,
    PRIMARY KEY (id_of_user, group_name),
    FOREIGN KEY (id_of_user) REFERENCES users(ID) ON DELETE CASCADE,
    FOREIGN KEY (group_name) REFERENCES groups(group_name) ON DELETE CASCADE
);

-- Group_Post Table (Many-to-Many: Groups and Posts)
CREATE TABLE group_posts (
    group_name VARCHAR(100) NOT NULL,     -- Foreign key referencing groups
    post_ID INT NOT NULL,      -- Foreign key referencing posts
    datum DATE NOT NULL,       -- Any additional attributes
    PRIMARY KEY (group_name, post_ID),  -- Composite primary key
    FOREIGN KEY (group_name) REFERENCES groups(group_name) ON DELETE CASCADE,
    FOREIGN KEY (post_ID) REFERENCES posts(ID) ON DELETE CASCADE
);


-- Comments Table
CREATE TABLE comments (
    ID SERIAL PRIMARY KEY,
    post_ID INT NOT NULL,
    content TEXT NOT NULL,
    datetime TIMESTAMP NOT NULL,
    FOREIGN KEY (post_ID) REFERENCES posts(ID) ON DELETE CASCADE
);

-- Reactions Table
CREATE TABLE reactions (
    ID SERIAL PRIMARY KEY,
    post_ID INT NOT NULL,
    reaction_type VARCHAR(10) CHECK (reaction_type IN ('Like', 'Love', 'Angry', 'Sad', 'Wow')) NOT NULL,
    FOREIGN KEY (post_ID) REFERENCES posts(ID) ON DELETE CASCADE
);

-- Tags Table
CREATE TABLE tags (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL
);

-- Post_Tags Table (Many-to-Many: Posts and Tags)
CREATE TABLE post_tags (
    post_ID INT NOT NULL,
    tag_ID INT NOT NULL,
    PRIMARY KEY (post_ID, tag_ID),
    FOREIGN KEY (post_ID) REFERENCES posts(ID) ON DELETE CASCADE,
    FOREIGN KEY (tag_ID) REFERENCES tags(ID) ON DELETE CASCADE
);
