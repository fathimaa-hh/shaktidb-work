INSERT INTO users (name, email, password)
VALUES
('Fathima', 'fathima@example.com', 'hashed_password_123');
INSERT INTO platforms (platform_name, website)
VALUES
('LeetCode', 'https://leetcode.com'),
('CodeChef', 'https://www.codechef.com'),
('HackerRank', 'https://www.hackerrank.com'),
('Codeforces', 'https://codeforces.com');
INSERT INTO topics (topic_name)
VALUES
('Arrays'),
('Strings'),
('Linked List'),
('Trees'),
('Graphs'),
('Dynamic Programming'),
('Binary Search'),
('Greedy');
INSERT INTO problems
(title, platform_id, topic_id, difficulty, problem_url)
VALUES
(
'Two Sum',
1,
1,
'Easy',
'https://leetcode.com/problems/two-sum/'
),
(
'Reverse Linked List',
1,
3,
'Easy',
'https://leetcode.com/problems/reverse-linked-list/'
),
(
'Longest Substring Without Repeating Characters',
1,
2,
'Medium',
'https://leetcode.com/problems/longest-substring-without-repeating-characters/'
),
(
'Number of Islands',
1,
5,
'Medium',
'https://leetcode.com/problems/number-of-islands/'
);

INSERT INTO user_problem_history
(
user_id,
problem_id,
status,
attempts,
time_taken,
language,
notes,
solved_date
)
VALUES
(
1,
1,
'Solved',
2,
15,
'C',
'Used HashMap approach',
'2026-06-25'
),
(
1,
2,
'Solved',
1,
20,
'Python',
'Iterative solution',
'2026-06-26'
),
(
1,
3,
'Attempted',
3,
45,
'Java',
'Need more practice',
'2026-06-27'
);

INSERT INTO contests
(
user_id,
platform_id,
contest_name,
rank,
score,
contest_date
)
VALUES
(
1,
1,
'Weekly Contest 460',
1200,
3.0,
'2026-06-20'
),
(
1,
2,
'CodeChef Starters 190',
900,
4.5,
'2026-06-22'
);
INSERT INTO daily_activity
(
user_id,
practice_date,
coding_minutes,
problems_solved
)
VALUES
(1,'2026-06-24',60,2),
(1,'2026-06-25',90,3),
(1,'2026-06-26',120,4),
(1,'2026-06-27',45,1);
