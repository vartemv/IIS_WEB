-- Create Users Table
CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    profile_name VARCHAR(50) UNIQUE NOT NULL,
    photo TEXT DEFAULT NULL,
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
    photo TEXT,
    owner INT NOT NULL,
    datum DATE NOT NULL,
    FOREIGN KEY (owner) REFERENCES users(ID) ON DELETE CASCADE
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

-- Table for tracking which users have access to private posts of other users
CREATE TABLE user_posts (
    id_of_user INT NOT NULL,
    post_ID INT NOT NULL,
    PRIMARY KEY (id_of_user, post_ID),
    FOREIGN KEY (id_of_user) REFERENCES users(ID) ON DELETE CASCADE,
    FOREIGN KEY (post_ID) REFERENCES posts(ID) ON DELETE CASCADE
);

-- Create Comments Table
CREATE TABLE comments (
    ID SERIAL PRIMARY KEY,
    post_ID INT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    datetime TIMESTAMP NOT NULL,
    FOREIGN KEY (post_ID) REFERENCES posts(ID) ON DELETE CASCADE,
    FOREIGN KEY (author) REFERENCES users(profile_name) ON DELETE CASCADE
);

-- Create Reactions Table
CREATE TABLE reactions (
    ID SERIAL PRIMARY KEY,
    post_ID INT NOT NULL,
    amount INT,
    FOREIGN KEY (post_ID) REFERENCES posts(ID) ON DELETE CASCADE
);

CREATE TABLE user_reactions (
    id_of_user INT NOT NULL,
    post_ID INT NOT NULL,
    PRIMARY KEY (id_of_user, post_ID),
    FOREIGN KEY (id_of_user) REFERENCES users(ID) ON DELETE CASCADE,
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

CREATE INDEX idx_post_tags_post_id ON post_tags (post_ID);

CREATE INDEX idx_reactions_post_id ON reactions (post_ID);

CREATE INDEX idx_comments_post_id ON comments (post_ID);

CREATE INDEX idx_comments_post_id_datetime ON comments (post_ID, datetime);

CREATE INDEX idx_reactions_post_id_amount ON reactions (post_ID, amount);
CREATE INDEX idx_comments_author ON comments (author);

-- Populate Users Table
INSERT INTO
    users (
        first_name,
        last_name,
        profile_name,
        sign_up_date,
        hash_password,
        email,
        role
    )
VALUES
    (
        'Erwin',
        'Smith',
        'admin',
        '1930-10-14',
        '$2a$10$uKM0rWYrHkOgC3dS71Y7P..Nr7OOntYyttoKn0ynHGm1EF41Fgfzq',
        'paradise@gmail.com',
        'Admin'
    ),
    (
        'Bob',
        'Johnson',
        'bobby_j',
        '2023-02-20',
        '$2a$10$SH2w1o.hwPjHa4BuDwpisOzKhLv36e0LNkCnZDcKWFi.8nWtDuqfm',
        'test1@gmail.com',
        'Mod'
    ),
    (
        'Charlie',
        'Brown',
        'charlie_b',
        '2023-03-10',
        '$2a$10$SH2w1o.hwPjHa4BuDwpisOzKhLv36e0LNkCnZDcKWFi.8nWtDuqfm',
        'test@gmil',
        'User'
    ),
    (
        'Diana',
        'Prince',
        'wonder_d',
        '2023-04-05',
        '$2a$10$SH2w1o.hwPjHa4BuDwpisOzKhLv36e0LNkCnZDcKWFi.8nWtDuqfm',
        'test3@gmail.com',
        'User'
    ),
    (
        'Delete',
        'Me',
        'test_delete',
        '2023-04-05',
        '$2a$10$SH2w1o.hwPjHa4BuDwpisOzKhLv36e0LNkCnZDcKWFi.8nWtDuqfm',
        'delete@gmail.com',
        'User'
    );
    ;

-- Populate Posts Table
INSERT INTO
    posts (
        user_ID,
        datetime,
        mediafile,
        description,
        location,
        availability
    )
VALUES
    (
        1,
        '2023-05-10 10:00:00',
        '/init_post_park.jpg',
        'A sunny day in the park.',
        'Central Park, NYC',
        TRUE
    ),
    (
        2,
        '2023-05-11 14:30:00',
        '/init_post_coffe.jpg',
        'Had a great coffee today.',
        'Starbucks, LA',
        TRUE
    ),
    (
        3,
        '2023-05-12 18:45:00',
        '/init_post_runner.jpeg',
        'Just finished a 5K run!',
        'San Francisco',
        TRUE
    ),
    (
        4,
        '2023-05-13 09:20:00',
        '/init_post_skater.jpg',
        'Check out this cool skate trick!',
        'Venice Beach',
        TRUE
    ),
    (
        4,
        '2023-05-13 09:20:00',
        '/1732479209300_peter.jpg',
        'Peter, the horse is here',
        'Family Home',
        TRUE
    );

-- Populate Groups Table
INSERT INTO
    groups (group_name, pocet, photo, owner, datum)
VALUES
    ('Nature Lovers', 2, '/init_club_nature.jpg', 1, '2023-01-01'),
    ('Coffee Enthusiasts', 1, '/init_club_coffe.jpg', 1, '2023-02-01'),
    ('Runners United', 1, '/init_club_run.jpg', 3, '2023-03-01'),
    ('Skaters Club', 2, '/init_club_skaters.jpg', 4, '2023-04-01'),
    ('Skiing Lads', 2, '/init_club_skiing.jpg', 2, '2023-05-01');

-- Populate User_Groups Table
INSERT INTO
    user_groups (id_of_user, group_name, status, datum)
VALUES
    (2, 'Nature Lovers', 'Pending', '2023-01-15'),
    (2, 'Coffee Enthusiasts', 'Pending', '2023-02-20'),
    (1, 'Runners United', 'Pending', '2023-03-10'),
    (3, 'Skaters Club', 'Active', '2023-04-05'),
    (4, 'Nature Lovers', 'Active', '2023-03-15'),
    (3, 'Coffee Enthusiasts', 'Pending', '2023-05-01'),
    (1, 'Skiing Lads', 'Active', '2023-05-01');

-- Populate Group_Posts Table
INSERT INTO
    group_posts (group_name, post_ID, datum)
VALUES
    ('Nature Lovers', 1, '2023-05-10'),
    ('Coffee Enthusiasts', 2, '2023-05-11'),
    ('Runners United', 3, '2023-05-12'),
    ('Skaters Club', 4, '2023-05-13');

-- Populate Comments Table
INSERT INTO
    comments (post_ID, content, datetime, author)
VALUES
    (
        1,
        'Beautiful photo!',
        '2023-05-10 10:30:00',
        'bobby_j'
    ),
    (
        2,
        'I love that place too!',
        '2023-05-11 15:00:00',
        'charlie_b'
    ),
    (
        3,
        'Great job on the run!',
        '2023-05-12 19:00:00',
        'wonder_d'
    ),
    (
        4,
        'Awesome trick!',
        '2023-05-13 09:45:00',
        'wonder_d'
    );

-- Populate Reactions Table
INSERT INTO
    reactions (post_ID, amount)
VALUES
    (1, 3),
    (2, 2),
    (3, 2),
    (4, 1),
    (5, 4);

INSERT INTO
    user_reactions (id_of_user, post_ID)
VALUES
    (2, 1),
    (3, 1),
    (4, 1),
    (3, 2),
    (4, 2),
    (1, 3),
    (2, 3),
    (2, 4),
    (1, 5),
    (2, 5),
    (3, 5),
    (4, 5);

-- Populate Tags Table
INSERT INTO
    tags (Name)
VALUES
    ('Nature'),
    ('Coffee'),
    ('Running'),
    ('Skating'),
    ('Photography');

-- Populate Post_Tags Table
INSERT INTO
    post_tags (post_ID, tag_ID)
VALUES
    (1, 1),
    -- Post 1 tagged as 'Nature'
    (1, 5),
    -- Post 1 tagged as 'Photography'
    (2, 2),
    -- Post 2 tagged as 'Coffee'
    (3, 3),
    -- Post 3 tagged as 'Running'
    (4, 4);

-- Post 4 tagged as 'Skating'