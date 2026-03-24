-- seed.sql
TRUNCATE students, marks RESTART IDENTITY CASCADE;

-- Seed students
INSERT INTO students (name, email, age) VALUES 
('Alice Johnson', 'alice@example.com', 20),
('Bob Smith', 'bob@example.com', 22),
('Charlie Brown', 'charlie@example.com', 19);

-- Seed marks for Alice (ID 1)
INSERT INTO marks (student_id, subject, score) VALUES 
(1, 'Mathematics', 95),
(1, 'Physics', 88);

-- Seed marks for Bob (ID 2)
INSERT INTO marks (student_id, subject, score) VALUES 
(2, 'Chemistry', 92);

