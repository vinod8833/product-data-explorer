UPDATE category SET navigation_id = 2 WHERE title IN ('Fiction', 'Romance', 'Mystery & Thriller', 'Science Fiction', 'Fantasy');

UPDATE category SET navigation_id = 3 WHERE title IN ('Non-Fiction', 'Biography', 'History', 'Self-Help');

UPDATE category SET navigation_id = 4 WHERE title = 'Children''s Books';

SELECT c.id, c.title as category_title, c.slug as category_slug, c.navigation_id, n.title as navigation_title, n.slug as navigation_slug
FROM category c
LEFT JOIN navigation n ON c.navigation_id = n.id
ORDER BY c.title;