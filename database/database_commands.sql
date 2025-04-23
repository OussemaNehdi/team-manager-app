-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- Create the workspaces table
CREATE TABLE workspaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Create the workspace_memberships table
CREATE TABLE workspace_memberships (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id INT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member'
);

-- Create the tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    workspace_id INT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline TIMESTAMP NOT NULL
);

-- Grant permissions to the database user
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO myuser;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO myuser;

-- Insert sample users
INSERT INTO users (email, password, name) VALUES
('user1@example.com', 'hashed_password_1', 'User One'),
('user2@example.com', 'hashed_password_2', 'User Two');

-- Insert sample workspaces
INSERT INTO workspaces (name, description, owner_id) VALUES
('Workspace 1', 'Description for Workspace 1', 1),
('Workspace 2', 'Description for Workspace 2', 2);

-- Insert sample workspace memberships
INSERT INTO workspace_memberships (user_id, workspace_id, role) VALUES
(1, 1, 'owner'),
(2, 1, 'member'),
(2, 2, 'owner');

-- Insert sample tasks
INSERT INTO tasks (workspace_id, title, description, deadline) VALUES
(1, 'Task 1', 'Description for Task 1', '2025-04-30 12:00:00'),
(1, 'Task 2', 'Description for Task 2', '2025-05-01 15:00:00'),
(2, 'Task 3', 'Description for Task 3', '2025-05-05 18:00:00');
