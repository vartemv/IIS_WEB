-- Create Users Table
CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    profile_name VARCHAR(50) UNIQUE NOT NULL,
    sign_up_date DATE NOT NULL,
    hash_password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(10) CHECK (role IN ('Admin', 'Mod', 'Rep', 'User')) DEFAULT 'User'
);

-- Create Posts Table
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

-- Create Groups Table
CREATE TABLE groups (
    group_name VARCHAR(100) PRIMARY KEY NOT NULL,
    pocet INT DEFAULT 0,
    owner INT NOT NULL,
    datum DATE NOT NULL
);

-- Create User_Groups Table (Many-to-Many: Users and Groups)
CREATE TABLE user_groups (
    id_of_user INT NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('Active', 'Pending', 'Banned')) DEFAULT 'Active',
    datum DATE NOT NULL,
    PRIMARY KEY (id_of_user, group_name),
    FOREIGN KEY (id_of_user) REFERENCES users(ID) ON DELETE CASCADE,
    FOREIGN KEY (group_name) REFERENCES groups(group_name) ON DELETE CASCADE
);

-- Create Group_Posts Table (Many-to-Many: Groups and Posts)
CREATE TABLE group_posts (
    group_name VARCHAR(100) NOT NULL,
    post_ID INT NOT NULL,
    datum DATE NOT NULL,
    PRIMARY KEY (group_name, post_ID),
    FOREIGN KEY (group_name) REFERENCES groups(group_name) ON DELETE CASCADE,
    FOREIGN KEY (post_ID) REFERENCES posts(ID) ON DELETE CASCADE
);

-- Create Comments Table
CREATE TABLE comments (
    ID SERIAL PRIMARY KEY,
    post_ID INT NOT NULL,
    content TEXT NOT NULL,
    datetime TIMESTAMP NOT NULL,
    FOREIGN KEY (post_ID) REFERENCES posts(ID) ON DELETE CASCADE
);

-- Create Reactions Table
CREATE TABLE reactions (
    ID SERIAL PRIMARY KEY,
    post_ID INT NOT NULL,
    amount INT,
    FOREIGN KEY (post_ID) REFERENCES posts(ID) ON DELETE CASCADE
);

-- Create Tags Table
CREATE TABLE tags (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL
);

-- Create Post_Tags Table (Many-to-Many: Posts and Tags)
CREATE TABLE post_tags (
    post_ID INT NOT NULL,
    tag_ID INT NOT NULL,
    PRIMARY KEY (post_ID, tag_ID),
    FOREIGN KEY (post_ID) REFERENCES posts(ID) ON DELETE CASCADE,
    FOREIGN KEY (tag_ID) REFERENCES tags(ID) ON DELETE CASCADE
);

-- Populate Users Table
INSERT INTO users (first_name, last_name, profile_name, sign_up_date, hash_password, email, role)
VALUES
    ('Erwin', 'Smith', 'admin', '1930-10-14', '$2a$10$uKM0rWYrHkOgC3dS71Y7P..Nr7OOntYyttoKn0ynHGm1EF41Fgfzq', 'paradise@gmail.com' ,'Admin'),
    ('Bob', 'Johnson', 'bobby_j', '2023-02-20', 'hashed_password_2', 'test1@gmail.com' ,'Mod'),
    ('Charlie', 'Brown', 'charlie_b', '2023-03-10', 'hashed_password_3', '$2a$10$SH2w1o.hwPjHa4BuDwpisOzKhLv36e0LNkCnZDcKWFi.8nWtDuqfm','User'),
    ('Diana', 'Prince', 'wonder_d', '2023-04-05', 'hashed_password_4', 'test3@gmail.com','User');

-- Populate Posts Table
INSERT INTO posts (user_ID, datetime, mediafile, description, location, availability)
VALUES
    (1, '2023-05-10 10:00:00', 'image1.jpg', 'A sunny day in the park.', 'Central Park, NYC', TRUE),
    (2, '2023-05-11 14:30:00', 'image2.jpg', 'Had a great coffee today.', 'Starbucks, LA', TRUE),
    (3, '2023-05-12 18:45:00', NULL, 'Just finished a 5K run!', 'San Francisco', TRUE),
    (4, '2023-05-13 09:20:00', 'video1.mp4', 'Check out this cool skate trick!', 'Venice Beach', TRUE);

-- Populate Groups Table
INSERT INTO groups (group_name, pocet, owner, datum)
VALUES
    ('Nature Lovers', 50, 1, '2023-01-01'),
    ('Coffee Enthusiasts', 30, 2, '2023-02-01'),
    ('Runners United', 20, 3, '2023-03-01'),
    ('Skaters Club', 15, 4, '2023-04-01');

-- Populate User_Groups Table
INSERT INTO user_groups (id_of_user, group_name, status, datum)
VALUES
    (1, 'Nature Lovers', 'Active', '2023-01-15'),
    (2, 'Coffee Enthusiasts', 'Active', '2023-02-20'),
    (3, 'Runners United', 'Pending', '2023-03-10'),
    (4, 'Skaters Club', 'Active', '2023-04-05'),
    (3, 'Nature Lovers', 'Active', '2023-03-15'),
    (4, 'Coffee Enthusiasts', 'Banned', '2023-05-01');

-- Populate Group_Posts Table
INSERT INTO group_posts (group_name, post_ID, datum)
VALUES
    ('Nature Lovers', 1, '2023-05-10'),
    ('Coffee Enthusiasts', 2, '2023-05-11'),
    ('Runners United', 3, '2023-05-12'),
    ('Skaters Club', 4, '2023-05-13');

-- Populate Comments Table
INSERT INTO comments (post_ID, content, datetime)
VALUES
    (1, 'Beautiful photo!', '2023-05-10 10:30:00'),
    (2, 'I love that place too!', '2023-05-11 15:00:00'),
    (3, 'Great job on the run!', '2023-05-12 19:00:00'),
    (4, 'Awesome trick!', '2023-05-13 09:45:00');

-- Populate Reactions Table
INSERT INTO reactions (post_ID, amount)
VALUES
    (1, 10),
    (2, 15),
    (3, 8),
    (4, 20);

-- Populate Tags Table
INSERT INTO tags (Name)
VALUES
    ('Nature'),
    ('Coffee'),
    ('Running'),
    ('Skating'),
    ('Photography');

-- Populate Post_Tags Table
INSERT INTO post_tags (post_ID, tag_ID)
VALUES
    (1, 1), -- Post 1 tagged as 'Nature'
    (1, 5), -- Post 1 tagged as 'Photography'
    (2, 2), -- Post 2 tagged as 'Coffee'
    (3, 3), -- Post 3 tagged as 'Running'
    (4, 4); -- Post 4 tagged as 'Skating'
