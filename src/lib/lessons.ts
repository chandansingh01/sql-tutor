export interface Exercise {
  id: string;
  prompt: string;
  expectedQuery: string;
  hints: string[];
  difficulty: "easy" | "medium" | "stretch";
}

export interface Lesson {
  slug: string;
  title: string;
  number: number;
  whyItMatters: string;
  concept: string;
  example: string;
  exercises: Exercise[];
  cheatSheet: string;
}

export const lessons: Lesson[] = [
  {
    slug: "select-from",
    title: "SELECT + FROM — Reading Data",
    number: 1,
    whyItMatters:
      "Every SQL query starts with SELECT. Whether you're building a dashboard, generating a report, or debugging — the first thing you do is read data.",
    concept: `**SELECT** picks which columns you want. **FROM** says which table to look in.

\`SELECT *\` means "all columns" — handy for exploring, but in production you should name the columns you need.`,
    example: `-- Get all books
SELECT * FROM books;

-- Get just titles and prices
SELECT title, price FROM books;`,
    exercises: [
      {
        id: "1-easy",
        prompt: "Get the names and countries of all authors.",
        expectedQuery: "SELECT name, country FROM authors",
        hints: ["Use SELECT with two column names", "The table is called 'authors'"],
        difficulty: "easy",
      },
      {
        id: "1-medium",
        prompt: "Get the title, genre, and price of every book.",
        expectedQuery: "SELECT title, genre, price FROM books",
        hints: ["List three column names after SELECT", "Separate columns with commas"],
        difficulty: "medium",
      },
      {
        id: "1-stretch",
        prompt: "Get every column from the customers table.",
        expectedQuery: "SELECT * FROM customers",
        hints: ["Use the * wildcard to select all columns"],
        difficulty: "stretch",
      },
    ],
    cheatSheet: `\`SELECT col1, col2 FROM table_name;\`
\`SELECT * FROM table_name;\` — all columns`,
  },
  {
    slug: "where",
    title: "WHERE — Filtering Rows",
    number: 2,
    whyItMatters:
      "You almost never want ALL the rows. WHERE lets you ask specific questions: which customers are from Mumbai? Which books cost less than ₹300?",
    concept: `**WHERE** filters rows based on a condition. It comes after FROM.

Common operators: \`=\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\``,
    example: `-- Books under ₹300
SELECT title, price FROM books WHERE price < 300;

-- Authors from India
SELECT name FROM authors WHERE country = 'India';`,
    exercises: [
      {
        id: "2-easy",
        prompt: "Find all books in the 'Fantasy' genre.",
        expectedQuery: "SELECT * FROM books WHERE genre = 'Fantasy'",
        hints: [
          "Use WHERE genre = '...'",
          "String values need single quotes: 'Fantasy'",
        ],
        difficulty: "easy",
      },
      {
        id: "2-medium",
        prompt: "Find all customers from Mumbai.",
        expectedQuery: "SELECT * FROM customers WHERE city = 'Mumbai'",
        hints: ["Filter on the city column", "WHERE city = 'Mumbai'"],
        difficulty: "medium",
      },
      {
        id: "2-stretch",
        prompt: "Find books published after 2010 that cost less than ₹300.",
        expectedQuery:
          "SELECT * FROM books WHERE published_year > 2010 AND price < 300",
        hints: [
          "You need two conditions",
          "Use AND to combine them",
          "published_year > 2010 AND price < 300",
        ],
        difficulty: "stretch",
      },
    ],
    cheatSheet: `\`WHERE condition\`
\`WHERE price > 300\`
\`WHERE city = 'Mumbai'\`
\`WHERE year > 2010 AND price < 300\``,
  },
  {
    slug: "compound-filters",
    title: "AND, OR, IN, LIKE — Compound Filters",
    number: 3,
    whyItMatters:
      "Real-world filters are never simple. You'll combine conditions constantly — 'show me fiction books from Indian authors priced under ₹400' is a typical request.",
    concept: `**AND** — both conditions must be true
**OR** — at least one must be true
**IN** — matches any value in a list (cleaner than multiple ORs)
**LIKE** — pattern matching with \`%\` (any characters) and \`_\` (one character)`,
    example: `-- IN: books by specific authors
SELECT * FROM books WHERE author_id IN (1, 3, 5);

-- LIKE: names starting with 'A'
SELECT name FROM customers WHERE name LIKE 'A%';

-- OR: fiction or fantasy
SELECT title FROM books WHERE genre = 'Fiction' OR genre = 'Fantasy';`,
    exercises: [
      {
        id: "3-easy",
        prompt: "Find all customers from Mumbai OR Delhi.",
        expectedQuery:
          "SELECT * FROM customers WHERE city IN ('Mumbai', 'Delhi')",
        hints: [
          "You can use OR, or the cleaner IN (...)",
          "IN ('Mumbai', 'Delhi')",
        ],
        difficulty: "easy",
      },
      {
        id: "3-medium",
        prompt: "Find all books whose title contains the word 'the' (case-insensitive).",
        expectedQuery:
          "SELECT * FROM books WHERE title LIKE '%the%'",
        hints: [
          "Use LIKE with % wildcards",
          "% means 'any characters'",
          "LIKE '%the%'",
        ],
        difficulty: "medium",
      },
      {
        id: "3-stretch",
        prompt:
          "Find Fiction books priced between ₹200 and ₹400 (inclusive) from authors with id 1, 3, or 7.",
        expectedQuery:
          "SELECT * FROM books WHERE genre = 'Fiction' AND price >= 200 AND price <= 400 AND author_id IN (1, 3, 7)",
        hints: [
          "Combine multiple AND conditions",
          "Use IN for the author_id list",
          "price >= 200 AND price <= 400",
        ],
        difficulty: "stretch",
      },
    ],
    cheatSheet: `\`WHERE x AND y\` — both true
\`WHERE x OR y\` — either true
\`WHERE col IN ('a', 'b')\` — matches any in list
\`WHERE col LIKE '%pattern%'\` — pattern match`,
  },
  {
    slug: "order-limit",
    title: "ORDER BY + LIMIT — Sorting & Pagination",
    number: 4,
    whyItMatters:
      "Every list, feed, and dashboard needs sorting. 'Show me the 5 most expensive books' or 'latest 10 orders' — this is ORDER BY + LIMIT.",
    concept: `**ORDER BY** sorts results. Default is ascending (ASC). Use **DESC** for descending.
**LIMIT** caps how many rows you get back — essential for pagination.`,
    example: `-- Top 5 most expensive books
SELECT title, price FROM books ORDER BY price DESC LIMIT 5;

-- Oldest authors first
SELECT name, birth_year FROM authors ORDER BY birth_year ASC;`,
    exercises: [
      {
        id: "4-easy",
        prompt: "List all books sorted by price, cheapest first.",
        expectedQuery: "SELECT * FROM books ORDER BY price ASC",
        hints: ["ORDER BY price", "ASC means ascending (low to high)"],
        difficulty: "easy",
      },
      {
        id: "4-medium",
        prompt: "Get the 3 most recently published books (title and year only).",
        expectedQuery:
          "SELECT title, published_year FROM books ORDER BY published_year DESC LIMIT 3",
        hints: [
          "ORDER BY published_year DESC",
          "LIMIT 3 to get just the top 3",
        ],
        difficulty: "medium",
      },
      {
        id: "4-stretch",
        prompt: "Find the 5 most recent orders, showing order id, customer id, and order date.",
        expectedQuery:
          "SELECT id, customer_id, order_date FROM orders ORDER BY order_date DESC LIMIT 5",
        hints: [
          "Select specific columns from orders",
          "Sort by order_date descending",
          "Limit to 5",
        ],
        difficulty: "stretch",
      },
    ],
    cheatSheet: `\`ORDER BY col ASC\` — ascending (default)
\`ORDER BY col DESC\` — descending
\`LIMIT n\` — return only n rows
\`ORDER BY col DESC LIMIT 5\` — top 5`,
  },
  {
    slug: "aggregates",
    title: "COUNT, SUM, AVG, MIN, MAX — Aggregates",
    number: 5,
    whyItMatters:
      "Every report and dashboard uses aggregates. 'How many orders did we get?' 'What's the average book price?' 'Total revenue?' — these are aggregate functions.",
    concept: `Aggregate functions collapse many rows into one summary value.

**COUNT(*)** — number of rows
**SUM(col)** — total of a column
**AVG(col)** — average value
**MIN(col)** / **MAX(col)** — smallest / largest`,
    example: `-- How many books?
SELECT COUNT(*) FROM books;

-- Average book price
SELECT AVG(price) FROM books;

-- Most expensive book
SELECT MAX(price) FROM books;`,
    exercises: [
      {
        id: "5-easy",
        prompt: "How many customers are there in total?",
        expectedQuery: "SELECT COUNT(*) FROM customers",
        hints: ["Use COUNT(*)", "FROM customers"],
        difficulty: "easy",
      },
      {
        id: "5-medium",
        prompt: "What is the total value of all book stock? (sum of price × stock for each book)",
        expectedQuery: "SELECT SUM(price * stock) FROM books",
        hints: [
          "You can do math inside SUM()",
          "SUM(price * stock)",
        ],
        difficulty: "medium",
      },
      {
        id: "5-stretch",
        prompt:
          "Find the average price, cheapest price, and most expensive price of Fiction books.",
        expectedQuery:
          "SELECT AVG(price), MIN(price), MAX(price) FROM books WHERE genre = 'Fiction'",
        hints: [
          "Use AVG, MIN, MAX together",
          "Add a WHERE clause for genre",
          "You can SELECT multiple aggregates at once",
        ],
        difficulty: "stretch",
      },
    ],
    cheatSheet: `\`COUNT(*)\` — number of rows
\`SUM(col)\` — total
\`AVG(col)\` — average
\`MIN(col)\` / \`MAX(col)\` — extremes`,
  },
  {
    slug: "group-by",
    title: "GROUP BY — Aggregates Per Category",
    number: 6,
    whyItMatters:
      "'Sales by region', 'users by plan tier', 'orders per month' — whenever someone says 'by' or 'per', you need GROUP BY. It splits data into groups then aggregates each one.",
    concept: `**GROUP BY** groups rows that share a value, then you aggregate each group separately.

Rule: every column in SELECT must either be in GROUP BY or inside an aggregate function.`,
    example: `-- Books per genre
SELECT genre, COUNT(*) as book_count
FROM books
GROUP BY genre;

-- Average price by genre
SELECT genre, AVG(price) as avg_price
FROM books
GROUP BY genre;`,
    exercises: [
      {
        id: "6-easy",
        prompt: "Count how many books each author has written. Show author_id and the count.",
        expectedQuery:
          "SELECT author_id, COUNT(*) as book_count FROM books GROUP BY author_id",
        hints: [
          "GROUP BY author_id",
          "Use COUNT(*) for the count",
        ],
        difficulty: "easy",
      },
      {
        id: "6-medium",
        prompt: "Find the total quantity ordered per customer. Show customer_id and total quantity.",
        expectedQuery:
          "SELECT customer_id, SUM(quantity) as total_qty FROM orders GROUP BY customer_id",
        hints: [
          "GROUP BY customer_id",
          "SUM(quantity) for the total",
        ],
        difficulty: "medium",
      },
      {
        id: "6-stretch",
        prompt:
          "Find the number of orders and total quantity for each month (order_date). Hint: use substr() to extract the month.",
        expectedQuery:
          "SELECT substr(order_date, 1, 7) as month, COUNT(*) as order_count, SUM(quantity) as total_qty FROM orders GROUP BY substr(order_date, 1, 7)",
        hints: [
          "substr(order_date, 1, 7) gives 'YYYY-MM'",
          "GROUP BY the same substr expression",
          "Use both COUNT and SUM",
        ],
        difficulty: "stretch",
      },
    ],
    cheatSheet: `\`GROUP BY col\` — group rows by column
\`SELECT col, COUNT(*) FROM t GROUP BY col\`
Every SELECT column must be grouped or aggregated`,
  },
  {
    slug: "inner-join",
    title: "INNER JOIN — Combining Tables",
    number: 7,
    whyItMatters:
      "This is the heart of relational databases. Data is split across tables — JOIN brings it back together. 'Show me order details with customer names' requires a JOIN.",
    concept: `**INNER JOIN** matches rows from two tables where a condition is true. Rows without a match are excluded.

\`table_a JOIN table_b ON table_a.id = table_b.a_id\``,
    example: `-- Books with author names
SELECT books.title, authors.name as author
FROM books
JOIN authors ON books.author_id = authors.id;

-- Orders with customer names
SELECT orders.id, customers.name, orders.order_date
FROM orders
JOIN customers ON orders.customer_id = customers.id;`,
    exercises: [
      {
        id: "7-easy",
        prompt: "List all books with their author's name. Show title and author name.",
        expectedQuery:
          "SELECT books.title, authors.name FROM books JOIN authors ON books.author_id = authors.id",
        hints: [
          "JOIN authors ON books.author_id = authors.id",
          "Select from both tables using table.column",
        ],
        difficulty: "easy",
      },
      {
        id: "7-medium",
        prompt:
          "Show all orders with the book title and customer name. Include order_date.",
        expectedQuery:
          "SELECT customers.name, books.title, orders.order_date FROM orders JOIN customers ON orders.customer_id = customers.id JOIN books ON orders.book_id = books.id",
        hints: [
          "You need TWO JOINs — one for customers, one for books",
          "Chain them: FROM orders JOIN customers ON ... JOIN books ON ...",
        ],
        difficulty: "medium",
      },
      {
        id: "7-stretch",
        prompt:
          "Find total spending per customer. Show customer name and total (price × quantity). Sort by total descending.",
        expectedQuery:
          "SELECT customers.name, SUM(books.price * orders.quantity) as total FROM orders JOIN customers ON orders.customer_id = customers.id JOIN books ON orders.book_id = books.id GROUP BY customers.name ORDER BY total DESC",
        hints: [
          "JOIN orders with customers and books",
          "SUM(books.price * orders.quantity)",
          "GROUP BY customers.name",
        ],
        difficulty: "stretch",
      },
    ],
    cheatSheet: `\`FROM a JOIN b ON a.id = b.a_id\`
\`FROM a JOIN b ON ... JOIN c ON ...\` — chain joins
INNER JOIN = only matching rows from both sides`,
  },
  {
    slug: "left-join",
    title: "LEFT JOIN + IS NULL — Optional Matches",
    number: 8,
    whyItMatters:
      "'Which users have never placed an order?' 'Which products have no reviews?' — LEFT JOIN keeps ALL rows from the left table, even when there's no match. Combined with IS NULL, it finds missing data.",
    concept: `**LEFT JOIN** returns all rows from the left table. If there's no match in the right table, you get NULLs.

**IS NULL** checks for missing values. Combined with LEFT JOIN, it finds rows that DON'T have a match.`,
    example: `-- All authors, even those with no books listed
SELECT authors.name, books.title
FROM authors
LEFT JOIN books ON authors.id = books.author_id;

-- Authors who have NO books
SELECT authors.name
FROM authors
LEFT JOIN books ON authors.id = books.author_id
WHERE books.id IS NULL;`,
    exercises: [
      {
        id: "8-easy",
        prompt:
          "List all customers with their orders (if any). Show customer name and order id. Include customers with no orders.",
        expectedQuery:
          "SELECT customers.name, orders.id FROM customers LEFT JOIN orders ON customers.id = orders.customer_id",
        hints: [
          "LEFT JOIN keeps all customers",
          "Customers without orders will show NULL for order id",
        ],
        difficulty: "easy",
      },
      {
        id: "8-medium",
        prompt:
          "Find customers who have never placed an order. Show only their name and email.",
        expectedQuery:
          "SELECT customers.name, customers.email FROM customers LEFT JOIN orders ON customers.id = orders.customer_id WHERE orders.id IS NULL",
        hints: [
          "LEFT JOIN, then filter WHERE orders.id IS NULL",
          "This finds the 'non-matches'",
        ],
        difficulty: "medium",
      },
      {
        id: "8-stretch",
        prompt:
          "Find how many orders each customer has, including customers with zero orders. Show name and order count, sorted by count descending.",
        expectedQuery:
          "SELECT customers.name, COUNT(orders.id) as order_count FROM customers LEFT JOIN orders ON customers.id = orders.customer_id GROUP BY customers.name ORDER BY order_count DESC",
        hints: [
          "COUNT(orders.id) counts non-null values — so 0 for no orders",
          "Use LEFT JOIN + GROUP BY",
          "COUNT(column) vs COUNT(*) matters here",
        ],
        difficulty: "stretch",
      },
    ],
    cheatSheet: `\`LEFT JOIN\` — keep all rows from left table
\`WHERE col IS NULL\` — find missing matches
\`COUNT(col)\` counts non-nulls (0 for no match)`,
  },
  {
    slug: "insert-update-delete",
    title: "INSERT, UPDATE, DELETE — Writing Data",
    number: 9,
    whyItMatters:
      "Reading data is only half the story. Every app creates, updates, and removes records. These are the other three letters in CRUD.",
    concept: `**INSERT** adds new rows.
**UPDATE** changes existing rows (always use WHERE or you'll update everything!).
**DELETE** removes rows (always use WHERE or you'll delete everything!).`,
    example: `-- Add a new customer
INSERT INTO customers VALUES (11, 'Test User', 'test@email.com', 'Pune', '2024-03-01');

-- Update a book's price
UPDATE books SET price = 349 WHERE id = 1;

-- Delete an order
DELETE FROM orders WHERE id = 25;`,
    exercises: [
      {
        id: "9-easy",
        prompt:
          "Insert a new author: id 9, name 'Ruskin Bond', country 'India', birth_year 1934.",
        expectedQuery:
          "INSERT INTO authors VALUES (9, 'Ruskin Bond', 'India', 1934)",
        hints: [
          "INSERT INTO table VALUES (...)",
          "Match the column order: id, name, country, birth_year",
        ],
        difficulty: "easy",
      },
      {
        id: "9-medium",
        prompt:
          "Increase the price of all Fantasy books by 50.",
        expectedQuery:
          "UPDATE books SET price = price + 50 WHERE genre = 'Fantasy'",
        hints: [
          "UPDATE table SET col = new_value WHERE condition",
          "You can use price = price + 50",
        ],
        difficulty: "medium",
      },
      {
        id: "9-stretch",
        prompt:
          "Delete all orders placed before '2023-09-01'. Then verify with SELECT COUNT(*) FROM orders.",
        expectedQuery:
          "DELETE FROM orders WHERE order_date < '2023-09-01'",
        hints: [
          "DELETE FROM orders WHERE condition",
          "Date comparison: order_date < '2023-09-01'",
          "String comparison works for ISO dates (YYYY-MM-DD)",
        ],
        difficulty: "stretch",
      },
    ],
    cheatSheet: `\`INSERT INTO t VALUES (...)\`
\`UPDATE t SET col = val WHERE ...\` — ALWAYS use WHERE
\`DELETE FROM t WHERE ...\` — ALWAYS use WHERE`,
  },
  {
    slug: "case-when",
    title: "CASE WHEN — Conditional Logic",
    number: 10,
    whyItMatters:
      "CASE WHEN is SQL's if/else. Used everywhere in reports: 'label orders as small/medium/large', 'flag overdue invoices', 'bucket users by activity level'.",
    concept: `**CASE WHEN** evaluates conditions and returns different values. It's like if/else inside your query.

\`\`\`sql
CASE
  WHEN condition THEN result
  WHEN condition2 THEN result2
  ELSE default
END
\`\`\``,
    example: `-- Price category
SELECT title, price,
  CASE
    WHEN price < 250 THEN 'Budget'
    WHEN price < 400 THEN 'Mid-range'
    ELSE 'Premium'
  END as price_tier
FROM books;`,
    exercises: [
      {
        id: "10-easy",
        prompt:
          "Add a column 'era' to authors: 'Classic' if born before 1950, 'Modern' otherwise. Show name, birth_year, and era.",
        expectedQuery:
          "SELECT name, birth_year, CASE WHEN birth_year < 1950 THEN 'Classic' ELSE 'Modern' END as era FROM authors",
        hints: [
          "CASE WHEN birth_year < 1950 THEN 'Classic' ELSE 'Modern' END",
          "Give it an alias with AS",
        ],
        difficulty: "easy",
      },
      {
        id: "10-medium",
        prompt:
          "Classify books by stock level: 'Low' (under 15), 'Medium' (15-30), 'High' (over 30). Show title and stock_level.",
        expectedQuery:
          "SELECT title, CASE WHEN stock < 15 THEN 'Low' WHEN stock <= 30 THEN 'Medium' ELSE 'High' END as stock_level FROM books",
        hints: [
          "Use multiple WHEN clauses",
          "WHEN stock < 15 THEN 'Low'",
          "Don't forget the END keyword",
        ],
        difficulty: "medium",
      },
      {
        id: "10-stretch",
        prompt:
          "Count how many books fall into each price tier (Budget < 250, Mid-range < 400, Premium >= 400).",
        expectedQuery:
          "SELECT CASE WHEN price < 250 THEN 'Budget' WHEN price < 400 THEN 'Mid-range' ELSE 'Premium' END as tier, COUNT(*) as count FROM books GROUP BY tier",
        hints: [
          "Put the CASE inside both SELECT and GROUP BY",
          "GROUP BY the tier alias",
          "COUNT(*) for each group",
        ],
        difficulty: "stretch",
      },
    ],
    cheatSheet: `\`CASE WHEN cond THEN val ELSE default END\`
Can use in SELECT, WHERE, ORDER BY
Always end with END
Give it an alias: \`... END as col_name\``,
  },
  {
    slug: "distinct-aliases-between",
    title: "DISTINCT + Aliases + BETWEEN — Cleanup & Readability",
    number: 11,
    whyItMatters:
      "These are the tools that make your queries production-ready. DISTINCT removes duplicates, aliases make output readable, and BETWEEN is cleaner than >= AND <=.",
    concept: `**DISTINCT** — removes duplicate rows
**AS** (alias) — renames columns or tables in output
**BETWEEN** — shorthand for >= AND <=, works with numbers and dates`,
    example: `-- Unique genres
SELECT DISTINCT genre FROM books;

-- Readable column names
SELECT title, price * 1.18 AS price_with_tax FROM books;

-- Date range
SELECT * FROM orders WHERE order_date BETWEEN '2023-10-01' AND '2023-12-31';`,
    exercises: [
      {
        id: "11-easy",
        prompt: "List all unique cities where customers live.",
        expectedQuery: "SELECT DISTINCT city FROM customers",
        hints: ["DISTINCT removes duplicates", "SELECT DISTINCT city FROM ..."],
        difficulty: "easy",
      },
      {
        id: "11-medium",
        prompt:
          "Show all books priced between ₹300 and ₹450 (inclusive). Show title and price.",
        expectedQuery:
          "SELECT title, price FROM books WHERE price BETWEEN 300 AND 450",
        hints: [
          "BETWEEN includes both endpoints",
          "WHERE price BETWEEN 300 AND 450",
        ],
        difficulty: "medium",
      },
      {
        id: "11-stretch",
        prompt:
          "List all orders from Q4 2023 (Oct-Dec) with readable column names: 'Order ID', 'Customer', and 'Date'. Join with customers.",
        expectedQuery:
          "SELECT orders.id AS 'Order ID', customers.name AS 'Customer', orders.order_date AS 'Date' FROM orders JOIN customers ON orders.customer_id = customers.id WHERE orders.order_date BETWEEN '2023-10-01' AND '2023-12-31'",
        hints: [
          "AS renames columns in output",
          "Combine JOIN with BETWEEN",
          "Use single quotes for alias names with spaces",
        ],
        difficulty: "stretch",
      },
    ],
    cheatSheet: `\`SELECT DISTINCT col\` — unique values
\`SELECT col AS alias\` — rename in output
\`WHERE col BETWEEN a AND b\` — inclusive range`,
  },
  {
    slug: "ctes",
    title: "CTEs (WITH ... AS) — Composable Queries",
    number: 12,
    whyItMatters:
      "CTEs are modern SQL's killer feature. Instead of nesting subqueries 3 levels deep, you name each step. They make complex queries readable and debuggable.",
    concept: `**WITH** creates a temporary named result set (a CTE) that you can reference like a table.

\`\`\`sql
WITH cte_name AS (
  SELECT ...
)
SELECT ... FROM cte_name;
\`\`\`

You can chain multiple CTEs with commas.`,
    example: `-- Top spending customers
WITH customer_totals AS (
  SELECT customer_id, SUM(quantity) as total_qty
  FROM orders
  GROUP BY customer_id
)
SELECT customers.name, customer_totals.total_qty
FROM customer_totals
JOIN customers ON customer_totals.customer_id = customers.id
ORDER BY total_qty DESC;`,
    exercises: [
      {
        id: "12-easy",
        prompt:
          "Using a CTE, find the average book price, then select all books priced above average. Show title and price.",
        expectedQuery:
          "WITH avg_price AS (SELECT AVG(price) as val FROM books) SELECT title, price FROM books, avg_price WHERE price > avg_price.val",
        hints: [
          "WITH avg_price AS (SELECT AVG(price) as val FROM books)",
          "Then SELECT from books where price > avg_price.val",
          "You can cross-join with a single-row CTE using commas",
        ],
        difficulty: "easy",
      },
      {
        id: "12-medium",
        prompt:
          "Using a CTE, find each author's book count, then show only authors with more than 1 book. Show name and count.",
        expectedQuery:
          "WITH author_books AS (SELECT author_id, COUNT(*) as book_count FROM books GROUP BY author_id) SELECT authors.name, author_books.book_count FROM author_books JOIN authors ON author_books.author_id = authors.id WHERE author_books.book_count > 1",
        hints: [
          "CTE: group books by author_id with COUNT",
          "Then JOIN with authors and filter WHERE count > 1",
        ],
        difficulty: "medium",
      },
      {
        id: "12-stretch",
        prompt:
          "Using two CTEs: (1) find each customer's total spend (price × quantity), (2) find the overall average spend. Then show customers who spent above average, with their name and total.",
        expectedQuery:
          "WITH customer_spend AS (SELECT orders.customer_id, SUM(books.price * orders.quantity) as total FROM orders JOIN books ON orders.book_id = books.id GROUP BY orders.customer_id), avg_spend AS (SELECT AVG(total) as val FROM customer_spend) SELECT customers.name, customer_spend.total FROM customer_spend JOIN customers ON customer_spend.customer_id = customers.id, avg_spend WHERE customer_spend.total > avg_spend.val ORDER BY customer_spend.total DESC",
        hints: [
          "First CTE: join orders + books, SUM(price * quantity), GROUP BY customer_id",
          "Second CTE: AVG(total) from the first CTE",
          "Final query: join first CTE with customers, filter by second CTE",
        ],
        difficulty: "stretch",
      },
    ],
    cheatSheet: `\`WITH name AS (SELECT ...) SELECT ... FROM name\`
Chain CTEs: \`WITH a AS (...), b AS (...) SELECT ...\`
CTEs replace messy nested subqueries`,
  },
];
