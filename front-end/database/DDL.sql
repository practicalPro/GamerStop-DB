-- Project  Title:  GamerStop
-- Group# 96
-- Members:  Brian Dy, Yen-Ting (Andy) Chou 
-- https://web.engr.oregonstate.edu/~dyb/CS340/index.html
--


SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_dyb`
--

-- --------------------------------------------------------

--
-- Table structure for table `Consoles`
--
DROP TABLE IF EXISTS `Consoles`;
CREATE TABLE `Consoles` (
  `consoleID` int(11) NOT NULL,
  `name` varchar(25) NOT NULL,
  `manufacturer` varchar(50) DEFAULT NULL,
  `releaseDate` date DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Consoles`
--

INSERT INTO `Consoles` (`consoleID`, `name`, `manufacturer`, `releaseDate`, `description`) VALUES
(1, 'YBox Series Y', 'Macrosoft', '2019-02-23', 'Unprecedented gaming experience for everyone'),
(2, 'QuantumStation ', 'Phony', '2020-02-02', 'The ultimate gaming console for daily leisure'),
(3, 'NovaX', 'Mintendo', '2023-01-31', 'Powerful and convenient gaming console');

-- --------------------------------------------------------

--
-- Table structure for table `Customers`
--
DROP TABLE IF EXISTS `Customers`;
CREATE TABLE `Customers` (
  `customerID` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Customers`
--

INSERT INTO `Customers` (`customerID`, `email`, `firstName`, `lastName`, `phone`) VALUES
(1, 'abc@gmail.com', 'Gordon', 'Wilcox', '620-977-1538'),
(2, 'wxy@outlook.com', 'Samson', 'Barton', '661-335-1004'),
(3, 'gg@oregonstate.edu', 'Kade', 'Oneal', '360-503-2238');

-- --------------------------------------------------------

--
-- Table structure for table `Invoices`
--
DROP TABLE IF EXISTS `Invoices`;
CREATE TABLE `Invoices` (
  `invoiceID` int(11) NOT NULL,
  `customerID` int(11) NOT NULL,
  `orderDate` date NOT NULL,
  `totalPrice` decimal(6,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Invoices`
--

INSERT INTO `Invoices` (`invoiceID`, `customerID`, `orderDate`, `totalPrice`) VALUES
(1, 2, '2023-07-26 00:00:00', 129.99),
(2, 3, '2023-09-08 00:00:00', 44.59),
(3, 1, '2023-10-01 00:00:00', 599.98);

-- --------------------------------------------------------

--
-- Table structure for table `Invoices_has_Products`
--
DROP TABLE IF EXISTS `Invoices_has_Products`;
CREATE TABLE `Invoices_has_Products` (
  `invoiceProductID` int(255) NOT NULL,
  `invoiceID` int(255) NOT NULL,
  `productID` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Invoices_has_Products`
--

INSERT INTO `Invoices_has_Products` (`invoiceProductID`, `invoiceID`, `productID`) VALUES
(1, 1, 1),
(2, 2, 3),
(3, 3, 2),
(4, 3, 4);

-- --------------------------------------------------------

--
-- Table structure for table `Products`
--
DROP TABLE IF EXISTS `Products`;
CREATE TABLE `Products` (
  `productID` int(255) NOT NULL,
  `price` decimal(6,2) NOT NULL,
  `consoleID` int(255) DEFAULT NULL,
  `videogameID` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Products`
--

INSERT INTO `Products` (`productID`, `price`, `consoleID`, `videogameID`) VALUES
(1, 129.99, 1, NULL),
(2, 549.99, 2, NULL),
(3, 44.59, NULL, 1),
(4, 50.49, NULL, 2),
(5, 199.99, 3, NULL),
(6, 23.99, NULL, 3);

-- --------------------------------------------------------

--
-- Table structure for table `Video_Games`
--
DROP TABLE IF EXISTS `Video_Games`;
CREATE TABLE `Video_Games` (
  `videogameID` int(11) NOT NULL,
  `title` varchar(45) NOT NULL,
  `genre` varchar(45) NOT NULL,
  `releaseDate` date DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Video_Games`
--

INSERT INTO `Video_Games` (`videogameID`, `title`, `genre`, `releaseDate`, `description`) VALUES
(1, 'Galactic Warfare: Mars', 'Action', '2019-02-03', 'First-person shooter against alien'),
(2, 'Fantasy Quest', 'Adventure', '2021-07-28', 'Fantasy adventure RPG'),
(3, 'CyberRift', 'Survival', '2015-05-16', 'Explore and survive the futuristic wildland');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Consoles`
--
ALTER TABLE `Consoles`
  ADD PRIMARY KEY (`consoleID`);

--
-- Indexes for table `Customers`
--
ALTER TABLE `Customers`
  ADD PRIMARY KEY (`customerID`),
  ADD UNIQUE KEY `idcustomer_UNIQUE` (`customerID`);

--
-- Indexes for table `Invoices`
--
ALTER TABLE `Invoices`
  ADD PRIMARY KEY (`invoiceID`),
  ADD KEY `fk_invoice_customer_idx` (`customerID`);

--
-- Indexes for table `Invoices_has_Products`
--
ALTER TABLE `Invoices_has_Products`
  ADD PRIMARY KEY (`invoiceProductID`),
  ADD KEY `fk_Invoices_has_Products_Products1_idx` (`productID`),
  ADD KEY `fk_Invoices_has_Products_Invoices1_idx` (`invoiceID`);

--
-- Indexes for table `Products`
--
ALTER TABLE `Products`
  ADD PRIMARY KEY (`productID`),
  ADD KEY `fk_consoleID_idx` (`consoleID`),
  ADD KEY `fk_videogameID_idx` (`videogameID`);

--
-- Indexes for table `Video_Games`
--
ALTER TABLE `Video_Games`
  ADD PRIMARY KEY (`videogameID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Consoles`
--
ALTER TABLE `Consoles`
  MODIFY `consoleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Customers`
--
ALTER TABLE `Customers`
  MODIFY `customerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Invoices`
--
ALTER TABLE `Invoices`
  MODIFY `invoiceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Invoices_has_Products`
--
ALTER TABLE `Invoices_has_Products`
  MODIFY `invoiceProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Products`
--
ALTER TABLE `Products`
  MODIFY `productID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Video_Games`
--
ALTER TABLE `Video_Games`
  MODIFY `videogameID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Invoices`
--
ALTER TABLE `Invoices`
  ADD CONSTRAINT `fk_customerID` FOREIGN KEY (`customerID`) REFERENCES `Customers` (`customerID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Invoices_has_Products`
--
ALTER TABLE `Invoices_has_Products`
  ADD CONSTRAINT `fk_Invoices_has_Products_Invoices1` FOREIGN KEY (`invoiceID`) REFERENCES `Invoices` (`invoiceID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Invoices_has_Products_Products1` FOREIGN KEY (`productID`) REFERENCES `Products` (`productID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Products`
--
ALTER TABLE `Products`
  ADD CONSTRAINT `fk_consoleID` FOREIGN KEY (`consoleID`) REFERENCES `Consoles` (`consoleID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_videogameID` FOREIGN KEY (`videogameID`) REFERENCES `Video_Games` (`videogameID`) ON DELETE CASCADE ON UPDATE CASCADE;

SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
