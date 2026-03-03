-- Create database
CREATE DATABASE IF NOT EXISTS easeshop;
USE easeshop;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(50),
    province VARCHAR(50),
    postalCode VARCHAR(20),
    isAdmin BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    category VARCHAR(50),
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    originalPrice DECIMAL(10,2),
    stock INT DEFAULT 0,
    image VARCHAR(500),
    rating DECIMAL(2,1) DEFAULT 0,
    reviewCount INT DEFAULT 0,
    colors JSON,
    sizes JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample products
INSERT INTO products (name, brand, category, description, price, stock, image) VALUES
('Sony WH-1000XM4 Wireless Headphones', 'Sony', 'electronics', 'Industry-leading noise cancellation with Dual Noise Sensor technology. 30-hour battery life with quick charging.', 24999, 100, 'https://images.pexels.com/photos/3394659/pexels-photo-3394659.jpeg'),
('Apple MacBook Pro 14-inch', 'Apple', 'electronics', 'Apple M3 chip with 16-core CPU, 40-core GPU, 16GB unified memory, 1TB SSD. 18-hour battery life.', 159999, 50, 'https://images.pexels.com/photos/18105/pexels-photo.jpg'),
('Classic Fit Cotton T-Shirt', 'Nike', 'clothing', '100% premium cotton, regular fit, ribbed crew neck, signature logo print.', 1299, 500, 'https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg'),
('Running Shoes', 'Nike', 'sports', 'React foam cushioning, breathable mesh upper, durable rubber outsole.', 5999, 200, 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'),
('The Psychology of Money', 'HarperCollins', 'books', 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.', 699, 150, 'https://studentstore.pk/cdn/shop/files/B_931_4.jpg');