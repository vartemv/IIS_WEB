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
    availability VARCHAR(8) CHECK (availability in ('public', 'private', 'group')) DEFAULT 'public',
    FOREIGN KEY (user_ID) REFERENCES users(ID) ON DELETE CASCADE
);

-- Groups Table
CREATE TABLE groups (
    ID SERIAL PRIMARY KEY,
    jmeno VARCHAR(100) NOT NULL,
    pocet INT DEFAULT 0,
    datum DATE NOT NULL
);

-- User_Group Table (Many-to-Many: Users and Groups)
CREATE TABLE user_groups (
    id_of_user INT NOT NULL,
    id_of_group INT NOT NULL,
    status VARCHAR(10) CHECK (status IN ('Active', 'Pending', 'Banned')) DEFAULT 'Active',
    datum DATE NOT NULL,
    PRIMARY KEY (id_of_user, id_of_group),
    FOREIGN KEY (id_of_user) REFERENCES users(ID) ON DELETE CASCADE,
    FOREIGN KEY (id_of_group) REFERENCES groups(ID) ON DELETE CASCADE
);

-- Group_Post Table (Many-to-Many: Groups and Posts)
CREATE TABLE group_posts (
    group_name VARCHAR(100) NOT NULL,
    datum DATE NOT NULL,
    PRIMARY KEY (ID),
    FOREIGN KEY (ID) REFERENCES posts(ID) ON DELETE CASCADE
);

-- Comments Table
CREATE TABLE comments (
    ID SERIAL PRIMARY KEY,
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
