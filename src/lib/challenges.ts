export interface Challenge {
  id: string;
  title: string;
  context: string;
  prompt: string;
  expectedQuery: string;
  timeLimit: number; // seconds
  difficulty: "easy" | "medium" | "hard";
  points: number;
}

export const challenges: Challenge[] = [
  // EASY — SELECT / WHERE / ORDER
  {
    id: "c1",
    title: "Customer Lookup",
    context: "A colleague needs a quick list of customers for an email campaign.",
    prompt: "Find all customers from Mumbai. Show their name and email, sorted alphabetically by name.",
    expectedQuery:
      "SELECT name, email FROM customers WHERE city = 'Mumbai' ORDER BY name",
    timeLimit: 90,
    difficulty: "easy",
    points: 100,
  },
  {
    id: "c2",
    title: "Bargain Hunter",
    context: "Marketing wants to run a 'Budget Reads' promotion.",
    prompt: "Find the 5 cheapest books. Show title, genre, and price.",
    expectedQuery:
      "SELECT title, genre, price FROM books ORDER BY price ASC LIMIT 5",
    timeLimit: 90,
    difficulty: "easy",
    points: 100,
  },
  {
    id: "c3",
    title: "Genre Search",
    context: "A customer is looking for specific types of books.",
    prompt: "Find all Fiction and Fantasy books, sorted by published year (newest first). Show title, genre, and year.",
    expectedQuery:
      "SELECT title, genre, published_year FROM books WHERE genre IN ('Fiction', 'Fantasy') ORDER BY published_year DESC",
    timeLimit: 90,
    difficulty: "easy",
    points: 100,
  },
  {
    id: "c4",
    title: "Recent Activity",
    context: "The ops team needs to check recent order volume.",
    prompt: "Find all orders from January 2024 onwards. Show order id, customer_id, and order_date.",
    expectedQuery:
      "SELECT id, customer_id, order_date FROM orders WHERE order_date >= '2024-01-01'",
    timeLimit: 90,
    difficulty: "easy",
    points: 100,
  },

  // MEDIUM — JOIN + GROUP BY + aggregates
  {
    id: "c5",
    title: "Revenue Report",
    context: "Finance needs total revenue per genre for Q4 planning.",
    prompt:
      "Find total revenue (price × quantity) per book genre. Show genre and total revenue, sorted by revenue descending.",
    expectedQuery:
      "SELECT books.genre, SUM(books.price * orders.quantity) as revenue FROM orders JOIN books ON orders.book_id = books.id GROUP BY books.genre ORDER BY revenue DESC",
    timeLimit: 120,
    difficulty: "medium",
    points: 200,
  },
  {
    id: "c6",
    title: "Top Customers",
    context: "Customer success wants to identify VIP customers for a loyalty program.",
    prompt:
      "Find the top 3 customers by number of orders. Show customer name and order count.",
    expectedQuery:
      "SELECT customers.name, COUNT(*) as order_count FROM orders JOIN customers ON orders.customer_id = customers.id GROUP BY customers.name ORDER BY order_count DESC LIMIT 3",
    timeLimit: 120,
    difficulty: "medium",
    points: 200,
  },
  {
    id: "c7",
    title: "Author Popularity",
    context: "Editorial is deciding which authors to approach for new deals.",
    prompt:
      "Find total copies sold per author. Show author name and total quantity, only for authors with more than 2 copies sold.",
    expectedQuery:
      "SELECT authors.name, SUM(orders.quantity) as total_sold FROM orders JOIN books ON orders.book_id = books.id JOIN authors ON books.author_id = authors.id GROUP BY authors.name HAVING total_sold > 2 ORDER BY total_sold DESC",
    timeLimit: 150,
    difficulty: "medium",
    points: 200,
  },
  {
    id: "c8",
    title: "Dormant Inventory",
    context: "Warehouse needs to identify books that aren't selling.",
    prompt:
      "Find books that have never been ordered. Show title and stock. (Hint: LEFT JOIN)",
    expectedQuery:
      "SELECT books.title, books.stock FROM books LEFT JOIN orders ON books.id = orders.book_id WHERE orders.id IS NULL",
    timeLimit: 150,
    difficulty: "medium",
    points: 200,
  },

  // HARD — CTE + CASE + multi-join
  {
    id: "c9",
    title: "Customer Segments",
    context: "Your manager needs a report bucketing customers by spending tier for the board meeting.",
    prompt:
      "Using a CTE, calculate each customer's total spend. Then classify as 'Bronze' (under 500), 'Silver' (500-1000), 'Gold' (over 1000). Show name, total, and tier.",
    expectedQuery:
      "WITH spend AS (SELECT orders.customer_id, SUM(books.price * orders.quantity) as total FROM orders JOIN books ON orders.book_id = books.id GROUP BY orders.customer_id) SELECT customers.name, spend.total, CASE WHEN spend.total < 500 THEN 'Bronze' WHEN spend.total <= 1000 THEN 'Silver' ELSE 'Gold' END as tier FROM spend JOIN customers ON spend.customer_id = customers.id ORDER BY spend.total DESC",
    timeLimit: 180,
    difficulty: "hard",
    points: 300,
  },
  {
    id: "c10",
    title: "Performance Dashboard",
    context: "Build a monthly sales dashboard for the CEO.",
    prompt:
      "Using a CTE, calculate monthly revenue (YYYY-MM from order_date). Then show only months with revenue above the overall monthly average. Show month and revenue.",
    expectedQuery:
      "WITH monthly AS (SELECT substr(orders.order_date, 1, 7) as month, SUM(books.price * orders.quantity) as revenue FROM orders JOIN books ON orders.book_id = books.id GROUP BY month), avg_rev AS (SELECT AVG(revenue) as val FROM monthly) SELECT monthly.month, monthly.revenue FROM monthly, avg_rev WHERE monthly.revenue > avg_rev.val ORDER BY monthly.month",
    timeLimit: 180,
    difficulty: "hard",
    points: 300,
  },
];
