CREATE TABLE Customer(
CustomerId INT NOT NULL AUTO_INCREMENT,
firstName VARCHAR(30),
lastName VARCHAR(30),
email VARCHAR(50),
phoneNum VARCHAR(15),
address VARCHAR(30),
city VARCHAR(30),
state VARCHAR(30),
postalCode VARCHAR(6),
country VARCHAR(30),
userId VARCHAR(30),
PRIMARY KEY (customerId)
);

CREATE TABLE PaymentMethod(
CustomerId INT,
paymentMethodId INT NOT NULL AUTO_INCREMENT,
paymentType VARCHAR(15),
paymentNumber VARCHAR(16),
paymentExpiryDate DATE,
PRIMARY KEY(paymentMethodId),
FOREIGN KEY(customerId) REFERENCES Customer(customerId) ON UPDATE CASCADE ON DELETE SET NULL 
);
CREATE TABLE Category(
categoryId INT NOT NULL AUTO_INCREMENT,
categoryName VARCHAR(50),
PRIMARY KEY(categoryId)
);

CREATE TABLE Product(
productId INT NOT NULL AUTO_INCREMENT,
categoryId INT,
productName VARCHAR(30),
productPrice DECIMAL(10,2),
productImageURL VARCHAR(50),
productImage BLOB,
productDesc VARCHAR(500),
PRIMARY KEY(productId),
FOREIGN KEY (categoryId) REFERENCES Category(categoryId) ON UPDATE CASCADE ON DELETE SET NULL
);
CREATE TABLE Review(
reviewId INT NOT NULL AUTO_INCREMENT,
productId INT,
customerId INT,
reviewRating INT,
reviewComment VARCHAR(500),
reviewDate DATE,
PRIMARY KEY(reviewId),
FOREIGN KEY(productId) REFERENCES Product(productId) ON UPDATE CASCADE ON DELETE SET NULL,
FOREIGN KEY(customerId) REFERENCES Customer(customerId) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE HasInCart(
inCartQuantity INT,
inCartPrice DECIMAL(10,2),
customerId INT,
productId INT,
FOREIGN KEY(productId) REFERENCES Product(productId) ON UPDATE CASCADE ON DELETE SET NULL,
FOREIGN KEY(customerId) REFERENCES Customer(customerId) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE OrderSummary(
orderId INT NOT NULL AUTO_INCREMENT,
customerId INT,
orderDate DATE,
totalAmount DECIMAL(10,2),
shipToAddress VARCHAR(50),
shipToCity VARCHAR(30),
shipToState VARCHAR(30),
shipToCountry VARCHAR(30),
shipToPostalCode VARCHAR(6),
PRIMARY KEY (OrderId),
FOREIGN KEY(customerId) REFERENCES Customer(customerId) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE OrderProduct(
orderProductQuantity INT,
orderProductPrice DECIMAL(10,2),
customerId INT,
orderId INT,
FOREIGN KEY(customerId) REFERENCES Customer(customerId) ON UPDATE CASCADE ON DELETE SET NULL,
FOREIGN KEY(orderId) REFERENCES OrderSummary(orderId) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE Warehouse(
warehouseId INT NOT NULL AUTO_INCREMENT,
warehouseName VARCHAR(30),
PRIMARY KEY(warehouseId)
);

CREATE TABLE Shipment(
orderId INT UNIQUE,
warehouseId INT,
shipmentId INT NOT NULL AUTO_INCREMENT,
shipmentDate DATE,
shipmentDesc VARCHAR(500),
PRIMARY KEY(shipmentId),
FOREIGN KEY(orderId) REFERENCES OrderSummary(orderId) ON UPDATE CASCADE ON DELETE SET NULL,
FOREIGN KEY(warehouseId) REFERENCES Warehouse(warehouseId) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE ProductInventory(
inventoryQuantity INT,
productId INT,
warehouseId INT,
FOREIGN KEY(warehouseId) REFERENCES Warehouse(warehouseId) ON UPDATE CASCADE ON DELETE SET NULL,
FOREIGN KEY(productId) REFERENCES Product(productId) ON UPDATE CASCADE ON DELETE SET NULL
);

