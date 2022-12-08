--DROP TABLE review;
--DROP TABLE shipment;
--DROP TABLE productinventory;
--DROP TABLE warehouse;
--DROP TABLE orderproduct;
--DROP TABLE incart;
--DROP TABLE product;
--DROP TABLE category;
--DROP TABLE ordersummary;
--DROP TABLE paymentmethod;
--DROP TABLE customer;

CREATE TABLE customer (
    customerId          INT IDENTITY,
    firstName           VARCHAR(40),
    lastName            VARCHAR(40),
    email               VARCHAR(50),
    phonenum            VARCHAR(20),
    address             VARCHAR(50),
    city                VARCHAR(40),
    state               VARCHAR(20),
    postalCode          VARCHAR(20),
    country             VARCHAR(40),
    userid              VARCHAR(20),
    password            VARCHAR(30),
    PRIMARY KEY (customerId)
);

CREATE TABLE paymentmethod (
    paymentMethodId     INT IDENTITY,
    paymentType         VARCHAR(20),
    paymentNumber       VARCHAR(30),
    paymentExpiryDate   DATE,
    customerId          INT,
    PRIMARY KEY (paymentMethodId),
    FOREIGN KEY (customerId) REFERENCES customer(customerid)
        ON UPDATE CASCADE ON DELETE CASCADE 
);

CREATE TABLE ordersummary (
    orderId             INT IDENTITY,
    orderDate           DATETIME,
    totalAmount         DECIMAL(10,2),
    shiptoAddress       VARCHAR(50),
    shiptoCity          VARCHAR(40),
    shiptoState         VARCHAR(20),
    shiptoPostalCode    VARCHAR(20),
    shiptoCountry       VARCHAR(40),
    customerId          INT,
    PRIMARY KEY (orderId),
    FOREIGN KEY (customerId) REFERENCES customer(customerid)
        ON UPDATE CASCADE ON DELETE CASCADE 
);

CREATE TABLE category (
    categoryId          INT IDENTITY,
    categoryName        VARCHAR(50),    
    PRIMARY KEY (categoryId)
);

CREATE TABLE product (
    productId           INT IDENTITY,
    productName         VARCHAR(40),
    productPrice        DECIMAL(10,2),
    productImageURL     VARCHAR(100),
    productImage        VARBINARY(MAX),
    productDesc         VARCHAR(1000),
    categoryId          INT,
    PRIMARY KEY (productId),
    FOREIGN KEY (categoryId) REFERENCES category(categoryId)
);

CREATE TABLE orderproduct (
    orderId             INT,
    productId           INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES ordersummary(orderId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE incart (
    orderId             INT,
    productId           INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES ordersummary(orderId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE warehouse (
    warehouseId         INT IDENTITY,
    warehouseName       VARCHAR(30),    
    PRIMARY KEY (warehouseId)
);

CREATE TABLE shipment (
    shipmentId          INT IDENTITY,
    shipmentDate        DATETIME,   
    shipmentDesc        VARCHAR(100),   
    warehouseId         INT, 
    PRIMARY KEY (shipmentId),
    FOREIGN KEY (warehouseId) REFERENCES warehouse(warehouseId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE productinventory ( 
    productId           INT,
    warehouseId         INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (productId, warehouseId),   
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (warehouseId) REFERENCES warehouse(warehouseId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE review (
    reviewId            INT IDENTITY,
    reviewRating        INT,
    reviewDate          DATETIME,   
    customerId          INT,
    productId           INT,
    reviewComment       VARCHAR(1000),          
    PRIMARY KEY (reviewId),
    FOREIGN KEY (customerId) REFERENCES customer(customerId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO category(categoryName) VALUES ('Base');
INSERT INTO category(categoryName) VALUES ('Ultra Light');
INSERT INTO category(categoryName) VALUES ('Desert');
INSERT INTO category(categoryName) VALUES ('Cold');
INSERT INTO category(categoryName) VALUES ('Water');
INSERT INTO category(categoryName) VALUES ('Utilities');
INSERT INTO category(categoryName) VALUES ('Beta Testing');

INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Small eBrick', 1, 'Our Base Model brick, light, robust, practical.', 1.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Medium eBrick', 1, 'Our Base Model brick, light, robust, practical but a bit bigger', 1.10);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Large eBrick', 1, 'Our Base Model brick, light, robust, practical but much bigger', 1.20);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Small eBrick2',1,'Even more robust, The big bad wolf will not be a worry.', 2.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Medium eBrick2',1,'Even more robust, The big bad wolf will not dare to blow on your house.', 2.20);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Large eBrick2',1,'Even more robust, The big bad wolf will be scared of you', 2.40);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Small Luce Brick', 2, 'Lighter than a feather, size does not matter.', 3.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Medium Luce Brick',2,'Lighter than a feather, but slightly bigger.',3.20);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Large Luce Brick',2,'Lighter than a feather, but much bigger.',3.40);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Small Desert Brick',3,'Built for warm weathers, these bricks will keep your house chilly and cozy.', 1.60);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Medium Desert Brick',3,'Built for warm wathers, these bricks will keep your house chilly and cosy. Slightly bigger.', 1.70);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Large Desert Brick',3,'Built for warm wathers, these bricks will keep your house chilly and cosy. Much bigger.', 1.80);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Small Antarctica Brick',4,'Built for extreme cold, you will never have to worry about paying for warmth.',1.50);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Medium Antarctica Brick',4,'Built for extreme cold, you will never have to worry about paying for warmth. Slightly bigger.',1.60);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Large Antarctica Brick',4,'Built for extreme cold, you will never have to worry about paying for warmth. Much bigger',1.70);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Aqua Brick', 5, 'Water-resistant, thermal insulator, Ideal for shore residences', 2.30 );
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Aqua Brick', 5, 'Water-resistant, thermal insulator, Ideal for shore residences. Slightly bigger', 2.50);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Aqua Brick', 5, 'Water-resistant, thermal insulator, Ideal for shore residences. Much bigger', 2.70);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Bricktonium knife', 6, 'Engineered to cut our special bricks, you will not have to worry about design errors', 22.60);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Morphable Brick', 7, 'Genre-defining, this brick can adopt any shape or form you specify on our included software. Beta-tested for now.', 580020.00);

INSERT INTO warehouse(warehouseName) VALUES ('Main warehouse');
INSERT INTO productinventory(productId, warehouseId, quantity, price) VALUES (1, 1, 5, 18);
INSERT INTO productinventory(productId, warehouseId, quantity, price) VALUES (2, 1, 10, 19);
INSERT INTO productinventory(productId, warehouseId, quantity, price) VALUES (3, 1, 3, 10);
INSERT INTO productinventory(productId, warehouseId, quantity, price) VALUES (4, 1, 2, 22);
INSERT INTO productinventory(productId, warehouseId, quantity, price) VALUES (5, 1, 6, 21.35);
INSERT INTO productinventory(productId, warehouseId, quantity, price) VALUES (6, 1, 3, 25);
INSERT INTO productinventory(productId, warehouseId, quantity, price) VALUES (7, 1, 1, 30);
INSERT INTO productinventory(productId, warehouseId, quantity, price) VALUES (8, 1, 0, 40);
INSERT INTO productinventory(productId, warehouseId, quantity, price) VALUES (9, 1, 2, 97);
INSERT INTO productinventory(productId, warehouseId, quantity, price) VALUES (10, 1, 3, 31);

INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Arnold', 'Anderson', 'a.anderson@gmail.com', '204-111-2222', '103 AnyWhere Street', 'Winnipeg', 'MB', 'R3X 45T', 'Canada', 'arnold' , 'test');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Bobby', 'Brown', 'bobby.brown@hotmail.ca', '572-342-8911', '222 Bush Avenue', 'Boston', 'MA', '22222', 'United States', 'bobby' , 'bobby');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Candace', 'Cole', 'cole@charity.org', '333-444-5555', '333 Central Crescent', 'Chicago', 'IL', '33333', 'United States', 'candace' , 'password');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Darren', 'Doe', 'oe@doe.com', '250-807-2222', '444 Dover Lane', 'Kelowna', 'BC', 'V1V 2X9', 'Canada', 'darren' , 'pw');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Elizabeth', 'Elliott', 'engel@uiowa.edu', '555-666-7777', '555 Everwood Street', 'Iowa City', 'IA', '52241', 'United States', 'beth' , 'test');

-- Order 1 can be shipped as have enough inventory
DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (1, '2019-10-15 10:25:55', 91.70)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 1, 1, 18)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 5, 2, 21.35)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 3, 1, 31);

DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (2, '2019-10-16 18:00:00', 106.75)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 5, 5, 21.35);

-- Order 3 cannot be shipped as do not have enough inventory for item 7
DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (3, '2019-10-15 3:30:22', 140)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 6, 2, 25)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 7, 3, 30);

DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (2, '2019-10-17 05:45:11', 327.85)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 3, 4, 10)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 8, 3, 40)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 13, 3, 23.25)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 16, 2, 21.05)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 19, 4, 14);

DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (5, '2019-10-15 10:25:55', 277.40)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 5, 4, 21.35)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 19, 2, 81)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 20, 3, 10);

-- New SQL DDL for lab 8
UPDATE Product SET productImageURL = 'bricks/eBrickS.jpg' WHERE ProductId = 1;
UPDATE Product SET productImageURL = 'bricks/eBrickM.jpg' WHERE ProductId = 2;
UPDATE Product SET productImageURL = 'bricks/eBrickL.jpg' WHERE ProductId = 3;
UPDATE Product SET productImageURL = 'bricks/eBrick2S.jpg' WHERE ProductId = 4;
UPDATE Product SET productImageURL = 'bricks/eBrick2M.jpg' WHERE ProductId = 5;
UPDATE Product SET productImageURL = 'bricks/eBrick2L.jpg' WHERE ProductId = 6;
UPDATE Product SET productImageURL = 'bricks/LuceBrickS.jpg' WHERE ProductId = 7;
UPDATE Product SET productImageURL = 'bricks/LuceBrickM.jpg' WHERE ProductId = 8;
UPDATE Product SET productImageURL = 'bricks/LuceBrickL.jpg' WHERE ProductId = 9;
UPDATE Product SET productImageURL = 'bricks/DesertBrickS.jpg' WHERE ProductId = 10;
UPDATE Product SET productImageURL = 'bricks/DesertBrickM.jpg' WHERE ProductId = 11;
UPDATE Product SET productImageURL = 'bricks/DesertBrickL.jpg' WHERE ProductId = 12;
UPDATE Product SET productImageURL = 'bricks/ColdBrickS.jpg' WHERE ProductId = 13;
UPDATE Product SET productImageURL = 'bricks/ColdBrickM.jpg' WHERE ProductId = 14;
UPDATE Product SET productImageURL = 'bricks/ColdBrickL.jpg' WHERE ProductId = 15;
UPDATE Product SET productImageURL = 'bricks/AquaBrickS.jpg' WHERE ProductId = 16;
UPDATE Product SET productImageURL = 'bricks/AquaBrickM.jpg' WHERE ProductId = 17;
UPDATE Product SET productImageURL = 'bricks/AquaBrickL.jpg' WHERE ProductId = 18;
UPDATE Product SET productImageURL = 'bricks/BrickKnife.jpg' WHERE ProductId = 19;
UPDATE Product SET productImageURL = 'bricks/morph.jpg' WHERE ProductId = 20;













-- Loads image data for product 1

