export const SEED_SQL = `
-- Authors
CREATE TABLE authors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  birth_year INTEGER
);

INSERT INTO authors VALUES (1, 'Chetan Bhagat', 'India', 1974);
INSERT INTO authors VALUES (2, 'J.K. Rowling', 'UK', 1965);
INSERT INTO authors VALUES (3, 'Haruki Murakami', 'Japan', 1949);
INSERT INTO authors VALUES (4, 'Gabriel Garcia Marquez', 'Colombia', 1927);
INSERT INTO authors VALUES (5, 'Chimamanda Ngozi Adichie', 'Nigeria', 1977);
INSERT INTO authors VALUES (6, 'George Orwell', 'UK', 1903);
INSERT INTO authors VALUES (7, 'Arundhati Roy', 'India', 1961);
INSERT INTO authors VALUES (8, 'Paulo Coelho', 'Brazil', 1947);

-- Books
CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  genre TEXT NOT NULL,
  price REAL NOT NULL,
  published_year INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (author_id) REFERENCES authors(id)
);

INSERT INTO books VALUES (1, 'Five Point Someone', 1, 'Fiction', 199, 2004, 25);
INSERT INTO books VALUES (2, 'Harry Potter and the Philosopher''s Stone', 2, 'Fantasy', 499, 1997, 50);
INSERT INTO books VALUES (3, 'Harry Potter and the Chamber of Secrets', 2, 'Fantasy', 499, 1998, 35);
INSERT INTO books VALUES (4, 'Norwegian Wood', 3, 'Fiction', 350, 1987, 15);
INSERT INTO books VALUES (5, 'Kafka on the Shore', 3, 'Fiction', 399, 2002, 20);
INSERT INTO books VALUES (6, 'One Hundred Years of Solitude', 4, 'Magical Realism', 450, 1967, 12);
INSERT INTO books VALUES (7, 'Love in the Time of Cholera', 4, 'Romance', 399, 1985, 8);
INSERT INTO books VALUES (8, 'Half of a Yellow Sun', 5, 'Historical Fiction', 375, 2006, 18);
INSERT INTO books VALUES (9, 'Americanah', 5, 'Fiction', 425, 2013, 22);
INSERT INTO books VALUES (10, '1984', 6, 'Dystopian', 299, 1949, 40);
INSERT INTO books VALUES (11, 'Animal Farm', 6, 'Satire', 199, 1945, 30);
INSERT INTO books VALUES (12, 'The God of Small Things', 7, 'Fiction', 350, 1997, 16);
INSERT INTO books VALUES (13, 'The Alchemist', 8, 'Adventure', 299, 1988, 55);
INSERT INTO books VALUES (14, 'Revolution 2020', 1, 'Fiction', 175, 2011, 20);
INSERT INTO books VALUES (15, 'The Ministry of Utmost Happiness', 7, 'Fiction', 399, 2017, 10);

-- Customers
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  joined_date TEXT NOT NULL
);

INSERT INTO customers VALUES (1, 'Aarav Sharma', 'aarav@email.com', 'Mumbai', '2023-01-15');
INSERT INTO customers VALUES (2, 'Priya Patel', 'priya@email.com', 'Delhi', '2023-02-20');
INSERT INTO customers VALUES (3, 'Rahul Kumar', 'rahul@email.com', 'Bangalore', '2023-03-10');
INSERT INTO customers VALUES (4, 'Sneha Reddy', 'sneha@email.com', 'Hyderabad', '2023-04-05');
INSERT INTO customers VALUES (5, 'Amit Singh', 'amit@email.com', 'Mumbai', '2023-05-12');
INSERT INTO customers VALUES (6, 'Neha Gupta', 'neha@email.com', 'Pune', '2023-06-18');
INSERT INTO customers VALUES (7, 'Vikram Joshi', 'vikram@email.com', 'Chennai', '2023-07-22');
INSERT INTO customers VALUES (8, 'Ananya Das', 'ananya@email.com', 'Kolkata', '2023-08-30');
INSERT INTO customers VALUES (9, 'Rohan Mehta', 'rohan@email.com', 'Mumbai', '2023-09-14');
INSERT INTO customers VALUES (10, 'Kavya Nair', 'kavya@email.com', 'Delhi', '2023-10-01');

-- Orders
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  order_date TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

INSERT INTO orders VALUES (1, 1, 2, 1, '2023-06-01');
INSERT INTO orders VALUES (2, 1, 10, 2, '2023-06-15');
INSERT INTO orders VALUES (3, 2, 13, 1, '2023-07-03');
INSERT INTO orders VALUES (4, 2, 1, 1, '2023-07-20');
INSERT INTO orders VALUES (5, 3, 5, 1, '2023-08-11');
INSERT INTO orders VALUES (6, 3, 8, 2, '2023-08-25');
INSERT INTO orders VALUES (7, 4, 2, 1, '2023-09-05');
INSERT INTO orders VALUES (8, 4, 3, 1, '2023-09-05');
INSERT INTO orders VALUES (9, 5, 6, 1, '2023-09-20');
INSERT INTO orders VALUES (10, 5, 10, 1, '2023-10-01');
INSERT INTO orders VALUES (11, 6, 13, 3, '2023-10-10');
INSERT INTO orders VALUES (12, 6, 11, 1, '2023-10-15');
INSERT INTO orders VALUES (13, 7, 4, 1, '2023-11-01');
INSERT INTO orders VALUES (14, 7, 12, 1, '2023-11-10');
INSERT INTO orders VALUES (15, 8, 9, 2, '2023-11-20');
INSERT INTO orders VALUES (16, 8, 15, 1, '2023-11-25');
INSERT INTO orders VALUES (17, 9, 2, 1, '2023-12-01');
INSERT INTO orders VALUES (18, 9, 14, 2, '2023-12-10');
INSERT INTO orders VALUES (19, 10, 7, 1, '2023-12-15');
INSERT INTO orders VALUES (20, 10, 8, 1, '2023-12-20');
INSERT INTO orders VALUES (21, 1, 13, 1, '2024-01-05');
INSERT INTO orders VALUES (22, 3, 10, 1, '2024-01-15');
INSERT INTO orders VALUES (23, 5, 2, 2, '2024-01-20');
INSERT INTO orders VALUES (24, 2, 6, 1, '2024-02-01');
INSERT INTO orders VALUES (25, 4, 9, 1, '2024-02-10');
`;
