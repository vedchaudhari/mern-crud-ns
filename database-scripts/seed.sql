-- seed.sql
TRUNCATE students, marks RESTART IDENTITY CASCADE;

-- Seed students - 4-12
INSERT INTO students (name, email, age) VALUES 
('Neha Gupta', 'neha.gupta@example.com', 21),
('Kabir Singh', 'kabir.singh@example.com', 23),
('Ananya Verma', 'ananya.verma@example.com', 18),
('Vikram Joshi', 'vikram.joshi@example.com', 24),
('Sneha Kulkarni', 'sneha.kulkarni@example.com', 20),
('Arjun Nair', 'arjun.nair@example.com', 22),
('Meera Iyer', 'meera.iyer@example.com', 21),
('Rahul Desai', 'rahul.desai@example.com', 23),
('Ishita Kapoor', 'ishita.kapoor@example.com', 19);

-- Seed marks for Neha (ID 4)
INSERT INTO marks (student_id, subject, score) VALUES 
(4, 'Mathematics', 85),
(4, 'Physics', 78);

-- Seed marks for Kabir (ID 5)
INSERT INTO marks (student_id, subject, score) VALUES 
(5, 'Chemistry', 90),
(5, 'Biology', 84);

-- Seed marks for Ananya (ID 6)
INSERT INTO marks (student_id, subject, score) VALUES 
(6, 'English', 88),
(6, 'History', 91);

-- Seed marks for Vikram (ID 7)
INSERT INTO marks (student_id, subject, score) VALUES 
(7, 'Mathematics', 93),
(7, 'Computer Science', 97);

-- Seed marks for Sneha (ID 8)
INSERT INTO marks (student_id, subject, score) VALUES 
(8, 'Physics', 82),
(8, 'Chemistry', 79);
