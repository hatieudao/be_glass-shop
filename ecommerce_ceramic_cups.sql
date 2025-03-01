CREATE TABLE `Customers` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255),
  `email` VARCHAR(255) UNIQUE,
  `password_hash` VARCHAR(255),
  `is_admin` BOOLEAN DEFAULT false,
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Products` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255),
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `ProductTypes` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `product_id` INT,
  `name` VARCHAR(255),
  `description` TEXT,
  `price` DECIMAL(10,2),
  `stock` INT,
  `image_url` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Orders` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `customer_id` INT,
  `status` ENUM('pending','completed','canceled') DEFAULT 'pending',
  `total_price` DECIMAL(10,2),
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `OrderItems` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `order_id` INT,
  `product_type_id` INT,
  `quantity` INT,
  `price` DECIMAL(10,2)
);

ALTER TABLE `ProductTypes` ADD FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`);

ALTER TABLE `Orders` ADD FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`id`);

ALTER TABLE `OrderItems` ADD FOREIGN KEY (`order_id`) REFERENCES `Orders` (`id`);

ALTER TABLE `OrderItems` ADD FOREIGN KEY (`product_type_id`) REFERENCES `ProductTypes` (`id`);

-- Insert the admin user
INSERT INTO Customers (name, email, password_hash, is_admin) 
VALUES ('Admin Seller', 'admin@example.com', 'hashed_password_here', TRUE);

-- Insert 10 products
INSERT INTO Products (name, description) VALUES
('Elegant White Cup', 'A classic white ceramic cup perfect for coffee or tea.'),
('Vintage Floral Cup', 'A beautifully designed floral ceramic cup for tea lovers.'),
('Matte Black Cup', 'A sleek matte black ceramic cup for modern aesthetics.'),
('Rustic Handmade Cup', 'A handcrafted rustic ceramic cup with a unique texture.'),
('Minimalist Blue Cup', 'A simple yet elegant blue ceramic cup.'),
('Glazed Green Cup', 'A green ceramic cup with a glossy finish.'),
('Speckled Beige Cup', 'A speckled beige ceramic cup for an earthy look.'),
('Classic Red Cup', 'A vibrant red ceramic cup perfect for any setting.'),
('Luxury Gold Rim Cup', 'A high-end ceramic cup with a gold rim.'),
('Japanese Style Cup', 'A traditional Japanese-style ceramic cup.');

-- Insert product types (at least 2 per product)
INSERT INTO ProductTypes (product_id, name, description, price, stock, image_url) VALUES
(1, 'Standard Size', '250ml classic white ceramic cup.', 10.99, 50, 'images/white_cup_standard.jpg'),
(1, 'Large Size', '350ml classic white ceramic cup.', 12.99, 30, 'images/white_cup_large.jpg'),
(2, 'Small Size', '200ml vintage floral ceramic cup.', 9.99, 40, 'images/floral_cup_small.jpg'),
(2, 'Standard Size', '300ml vintage floral ceramic cup.', 11.99, 35, 'images/floral_cup_standard.jpg'),
(3, 'Matte Finish', '250ml matte black ceramic cup.', 13.99, 25, 'images/black_cup_matte.jpg'),
(3, 'Glossy Finish', '250ml glossy black ceramic cup.', 13.99, 25, 'images/black_cup_glossy.jpg'),
(4, 'Handmade Variant 1', 'Handmade 280ml ceramic cup.', 14.99, 20, 'images/handmade_cup_1.jpg'),
(4, 'Handmade Variant 2', 'Handmade 350ml ceramic cup.', 16.99, 15, 'images/handmade_cup_2.jpg'),
(5, 'Standard Blue', '250ml minimalist blue ceramic cup.', 11.99, 30, 'images/blue_cup_standard.jpg'),
(5, 'Large Blue', '350ml minimalist blue ceramic cup.', 13.99, 20, 'images/blue_cup_large.jpg');
