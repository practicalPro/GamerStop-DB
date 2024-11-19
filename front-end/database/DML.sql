-- Brian Dy
-- Yen-Ting (Andy) Chou 
-- CS340 Project Step 3 Final - Team 96

-- Access to HTML SITE
-- https://web.engr.oregonstate.edu/~dyb/CS340/index.html

-- SELECT queries
-- get all customers and their info (non user query for testing purpose)
SELECT * FROM Customers;

-- get all invoices and the info (non user query for testing purpose)
SELECT * FROM Invoices;

-- get all products and their details (non user query for testing purpose)
SELECT * FROM Products;

-- get all consoles and information about them (non user query for testing purpose)
SELECT * FROM Consoles;

-- get all video games and detials about them (non user query for testing purpose)
Select videogameID, title, genre, DATE_FORMAT(releaseDate, "%d-%m-%y") AS releaseDate from Video_Games;

-- get intereaction table
SELECT * FROM Invoices_has_Products;

-- get the email, first name, last name, and phone number from the Customers entity (user query, hide customer id)
SELECT email, firstName, lastName, phone
FROM Customers;

-- get invoice id, order date, and total price (user query, hide customer id)
SELECT invoiceID,orderDate,totalPrice
FROM Invoices;

-- get invoices id with customers name
SELECT Invoices.invoiceID, Customers.firstName, Customers.lastName
FROM Invoices
INNER JOIN Customers ON Invoices.customerID = Customers.customerID;

-- search for invoice id and return total price, purchase date, and customer fname/lname
SELECT Customers.firstName,Customers.lastName,Invoices.totalPrice,Invoices.orderDate 
FROM Invoices
JOIN Customers on Invoices.customerID=Customers.customerID 
WHERE customerID = :customerID;

-- get products (video games) details including price, name, genre,
SELECT  Products.productID, Video_Games.title AS Title, Video_Games.genre AS Genre, Video_Games.description, Video_Games.releaseDate AS 'release date',Products.price
FROM Products
INNER JOIN Video_Games ON Products.videogameID = Video_Games.videogameID AND  Products.videogameID IS NOT NULL;

-- get products (consoles) details including price, title, manufactor
SELECT  Products.productID, Consoles.name, Consoles.manufacturer, Consoles.description, Consoles.releaseDate, Products.price
FROM Products
INNER JOIN Consoles ON Products.consoleID = Consoles.consoleID AND Products.consoleID IS NOT NULL;

-- get product ID, price, title of video game, or consoles name from invoice ID
SELECT Invoices.invoiceID, Products.productID, Products.price, COALESCE(Video_Games.title,'') AS 'Video Games', COALESCE(Consoles.name,'') AS 'Consoles'
FROM Invoices
JOIN Invoices_has_Products ON Invoices.invoiceID = Invoices_has_Products.invoiceID
JOIN Products ON Invoices_has_Products.productID = Products.productID
LEFT JOIN Video_Games ON Products.videogameID = Video_Games.videogameID
LEFT JOIN Consoles on Products.consoleID = Consoles.consoleID;


-- get product id from invoice ID (testing use)
SELECT Invoices.invoiceID,Invoices_has_Products.productID  
From Invoices 
JOIN Invoices_has_Products ON Invoices.invoiceID = Invoices_has_Products.invoiceID


-- get product id from invoice (testing use)
SELECT Invoices_has_Products.invoiceID, Products.productID  
From Invoices_has_Products 
JOIN Products ON Invoices_has_Products.productID = Products.productID;

-- INSERT queries for each entities
-- INSERT queries for Consoles
INSERT INTO Consoles (name, manufacturer, releaseDate, description) 
VALUES (:name, :manufacturer, :releaseDate, :description);

-- INSERT queries for Customers
INSERT INTO Customers (email, firstName, lastName, phone) 
VALUES (:email, :firstName, :lastName, :phone);

-- INSERT queries for Invoices
INSERT INTO Invoices (orderDate, totalPrice) 
VALUES (:orderDate, :totalPrice);

-- set to invoice id to last inser id for intersection table
SET @invoiceID = LAST_INSERT_ID();

-- INSERT queries for Invoices_has_Products (Many-to-Many Relationship)
INSERT INTO Invoices_has_Products (invoiceID, productID) 
VALUES (@invoiceID, :productID);

-- INSERT queries for Products (NULLable)
INSERT INTO Products (price, consoleID, videogameID) 
VALUES (:price, :consoleID, :videogameID);

-- set to product id to last inser id for intersection table
SET @productID = LAST_INSERT_ID();

-- insert products
INSERT INTO Invoices_has_Products (invoiceID, productID) 
VALUES (:invoiceID, @productID); 

-- INSERT queries for Video_Games
INSERT INTO Video_Games (title, genre, releaseDate, description) 
VALUES (:title, :genre, :releaseDate, :description);

-- DELETE queries for removing products from invoices (Remove M:N relationship)
DELETE FROM Invoices_has_Products 
WHERE productID = :productID AND invoiceID = :invoiceID;

--Delete consoles
DELETE FROM Consoles
WHERE consoleID = :consoleID;

--Delete customer
DELETE FROM Customers
WHERE customerID=:customerID;

--Delete invoice
DELETE FROM Invoices
WHERE invoiceID=:invoiceID;

--Delete product
DELETE FROM Products
WHERE productID=:productID;

--Delete video game
DELETE FROM Video_Games
WHERE videogameID=:videogameID

-- UPDATE queries for Invoices
UPDATE Invoices SET orderDate = :orderDate, totalPrice = :totalPrice 
WHERE invoiceid = :invoiceID;

--update for consoles
UPDATE Consoles SET name=:name, manufacturer=:manufacturer, releaseDate=:releaseDate, description=:description
WHERE consoleID=:consoleID;

-- Update for customers
UPDATE Customers SET email=:email, firstName=:firstName, lastName=:lastName,phone=:phone
WHERE customerID=:customerID;

-- Update for products
UPDATE Products SET price=:price, consoleID=:consoleID, videogameID=:videogameID
WHERE productID=:productID;


-- update for video games
UPDATE Video_Games SET title=:title, genre=:genre, releaseDate=:releaseDate, description=:description
WHERE videogameID=:videogameID

-- update for invoice has product (intersection table) still thinking if we need it or not
-- UPDATE Invoices_has_Products SET invoiceID=:invoiceID, productID=:productID
-- WHERE invoiceProductID=:invoiceProductID;
