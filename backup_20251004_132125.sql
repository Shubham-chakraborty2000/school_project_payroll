-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: payroll_management
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `allowance`
--

DROP TABLE IF EXISTS `allowance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `allowance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `effective_date` date NOT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `allowance_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employeeinformation` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allowance`
--

LOCK TABLES `allowance` WRITE;
/*!40000 ALTER TABLE `allowance` DISABLE KEYS */;
INSERT INTO `allowance` VALUES (1,1,'Housing',8000.00,'2025-09-01','2025-09-23 16:51:13'),(2,1,'Transport',3000.00,'2025-09-01','2025-09-23 16:51:13'),(3,2,'Housing',9000.00,'2025-09-01','2025-09-23 16:51:13');
/*!40000 ALTER TABLE `allowance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendancerecords`
--

DROP TABLE IF EXISTS `attendancerecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendancerecords` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `log_type` enum('IN','OUT') NOT NULL,
  `datetime_log` datetime NOT NULL,
  `date_update` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `attendancerecords_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employeeinformation` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendancerecords`
--

LOCK TABLES `attendancerecords` WRITE;
/*!40000 ALTER TABLE `attendancerecords` DISABLE KEYS */;
INSERT INTO `attendancerecords` VALUES (1,1,'IN','2025-09-01 09:00:00','2025-09-01'),(2,1,'OUT','2025-09-01 17:00:00','2025-09-01'),(3,2,'IN','2025-09-01 09:10:00','2025-09-01'),(4,2,'OUT','2025-09-01 17:20:00','2025-09-01');
/*!40000 ALTER TABLE `attendancerecords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bankdetails`
--

DROP TABLE IF EXISTS `bankdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bankdetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL,
  `year` int NOT NULL,
  `month` int NOT NULL,
  `AccountNo` varchar(30) NOT NULL,
  `AccountName` varchar(100) NOT NULL,
  `phonenumber` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `emp_id` (`emp_id`),
  CONSTRAINT `bankdetails_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employeeinformation` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bankdetails`
--

LOCK TABLES `bankdetails` WRITE;
/*!40000 ALTER TABLE `bankdetails` DISABLE KEYS */;
INSERT INTO `bankdetails` VALUES (1,1,2025,9,'1234567890','shubham','01710000001'),(2,2,2025,9,'9876543210','purbayan','01710000002');
/*!40000 ALTER TABLE `bankdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deduction`
--

DROP TABLE IF EXISTS `deduction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deduction` (
  `deduction_id` int NOT NULL AUTO_INCREMENT,
  `salary_advance` decimal(10,2) DEFAULT NULL,
  `pension` decimal(10,2) DEFAULT NULL,
  `tax` decimal(10,2) DEFAULT NULL,
  `national_fund` decimal(10,2) DEFAULT NULL,
  `total_deduction` decimal(12,2) DEFAULT NULL,
  `bank_id` int NOT NULL,
  PRIMARY KEY (`deduction_id`),
  KEY `bank_id` (`bank_id`),
  CONSTRAINT `deduction_ibfk_1` FOREIGN KEY (`bank_id`) REFERENCES `bankdetails` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deduction`
--

LOCK TABLES `deduction` WRITE;
/*!40000 ALTER TABLE `deduction` DISABLE KEYS */;
INSERT INTO `deduction` VALUES (1,5000.00,2000.00,3000.00,1000.00,11000.00,1),(2,5000.00,2000.00,3000.00,1000.00,11000.00,1);
/*!40000 ALTER TABLE `deduction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employeeinformation`
--

DROP TABLE IF EXISTS `employeeinformation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeeinformation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_no` varchar(20) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `middlename` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) NOT NULL,
  `department_id` int NOT NULL,
  `position_id` int NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_no` (`employee_no`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employeeinformation`
--

LOCK TABLES `employeeinformation` WRITE;
/*!40000 ALTER TABLE `employeeinformation` DISABLE KEYS */;
INSERT INTO `employeeinformation` VALUES (1,'E1001','John','A','Doe',2,3,45000.00),(2,'EMP002','Karim',NULL,'Sheikh',2,3,40000.00);
/*!40000 ALTER TABLE `employeeinformation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grosspay`
--

DROP TABLE IF EXISTS `grosspay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grosspay` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `gross_salary` decimal(12,2) NOT NULL,
  `total_pay` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `grosspay_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employeeinformation` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grosspay`
--

LOCK TABLES `grosspay` WRITE;
/*!40000 ALTER TABLE `grosspay` DISABLE KEYS */;
INSERT INTO `grosspay` VALUES (1,1,37000.00,39000.00),(2,2,42000.00,45000.00);
/*!40000 ALTER TABLE `grosspay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monthlyentries`
--

DROP TABLE IF EXISTS `monthlyentries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monthlyentries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bank_id` int NOT NULL,
  `basic_salary` decimal(10,2) DEFAULT NULL,
  `housing_allowance` decimal(10,2) DEFAULT NULL,
  `transport_allowance` decimal(10,2) DEFAULT NULL,
  `overtime_shift` decimal(10,2) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bank_id` (`bank_id`),
  CONSTRAINT `monthlyentries_ibfk_1` FOREIGN KEY (`bank_id`) REFERENCES `bankdetails` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monthlyentries`
--

LOCK TABLES `monthlyentries` WRITE;
/*!40000 ALTER TABLE `monthlyentries` DISABLE KEYS */;
INSERT INTO `monthlyentries` VALUES (1,1,35000.00,8000.00,3000.00,2000.00,'01710000001');
/*!40000 ALTER TABLE `monthlyentries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payroll`
--

DROP TABLE IF EXISTS `payroll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payroll` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `days_present` int DEFAULT '0',
  `days_absent` int DEFAULT '0',
  `days_late` int DEFAULT '0',
  `salary_amount` decimal(12,2) NOT NULL,
  `allowance_amount` decimal(12,2) DEFAULT '0.00',
  `allowance_desc` varchar(255) DEFAULT NULL,
  `deduction_amount` decimal(12,2) DEFAULT '0.00',
  `deduction_desc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `payroll_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employeeinformation` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payroll`
--

LOCK TABLES `payroll` WRITE;
/*!40000 ALTER TABLE `payroll` DISABLE KEYS */;
INSERT INTO `payroll` VALUES (1,1,26,2,1,35000.00,11000.00,'Housing + Transport',5000.00,'Advance + Tax'),(2,2,27,1,0,40000.00,12500.00,'Housing + Overtime',4800.00,'Pension + Tax');
/*!40000 ALTER TABLE `payroll` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salary`
--

DROP TABLE IF EXISTS `salary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salary` (
  `salary_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `annual` decimal(12,2) DEFAULT NULL,
  `bonus` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`salary_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `salary_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employeeinformation` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salary`
--

LOCK TABLES `salary` WRITE;
/*!40000 ALTER TABLE `salary` DISABLE KEYS */;
INSERT INTO `salary` VALUES (1,1,35000.00,420000.00,20000.00),(2,2,40000.00,480000.00,25000.00);
/*!40000 ALTER TABLE `salary` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-04 13:21:31
