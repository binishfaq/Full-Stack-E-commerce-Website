-- Create database (if not already created)
CREATE DATABASE IF NOT EXISTS easeshop;
USE easeshop;

-- Users table (shared by Auth and User services)
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

-- Products table (Product service)
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

-- Categories table (Product service)
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(500),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table (Order service)
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    orderNumber VARCHAR(50) UNIQUE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    paymentMethod VARCHAR(50),
    shippingAddress TEXT,
    city VARCHAR(50),
    province VARCHAR(50),
    postalCode VARCHAR(20),
    notes TEXT,
    status ENUM('Processing','Confirmed','Shipped','Delivered','Cancelled') DEFAULT 'Processing',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT
);

-- Order items table (Order service)
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id)
);

-- Insert sample categories
INSERT IGNORE INTO categories (name, description) VALUES
('electronics', 'Latest gadgets and devices'),
('clothing', 'Fashion for everyone'),
('sports', 'Stay active and healthy'),
('books', 'Knowledge at your fingertips'),
('beauty', 'Look and feel your best'),
('home-appliances', 'Make your home smart'),
('groceries', 'Fresh food & essentials'),
('toys', 'Fun for all ages'),
('automotive', 'Everything for your vehicle'),
('furniture', 'Comfort for your home');

-- Insert sample products (optional – you already have products)
-- (Add your own product inserts here if needed)