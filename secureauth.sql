-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: secureauth
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `login_history`
--

DROP TABLE IF EXISTS `login_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `browser` varchar(255) DEFAULT NULL,
  `os` varchar(255) DEFAULT NULL,
  `login_status` enum('SUCCESS','FAILED') NOT NULL,
  `login_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_history`
--

LOCK TABLES `login_history` WRITE;
/*!40000 ALTER TABLE `login_history` DISABLE KEYS */;
INSERT INTO `login_history` VALUES (1,NULL,'::1','Chrome 149','Windows 10','FAILED','2026-07-05 09:33:18'),(2,NULL,'::1','Chrome 149','Windows 10','FAILED','2026-07-05 09:33:34'),(3,4,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-05 09:33:45'),(4,4,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-05 09:50:56'),(5,4,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-05 09:57:07'),(6,NULL,'::1','Chrome 149','Windows 10','FAILED','2026-07-05 09:57:31'),(7,4,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-05 09:57:44'),(8,4,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-05 10:18:13'),(9,4,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-05 10:32:11'),(10,4,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-05 10:33:25'),(11,4,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-05 10:36:42'),(12,4,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-05 10:37:51'),(13,4,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-05 16:49:14'),(14,NULL,'::1','Chrome 149','Windows 10','FAILED','2026-07-05 17:11:44'),(15,NULL,'::1','Chrome 149','Windows 10','FAILED','2026-07-05 17:11:48'),(16,NULL,'::1','Chrome 149','Windows 10','FAILED','2026-07-05 17:11:52'),(17,NULL,'::1','Chrome 149','Windows 10','FAILED','2026-07-05 17:11:56'),(18,NULL,'::1','Chrome 149','Windows 10','FAILED','2026-07-05 17:12:00'),(19,4,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-05 17:16:51'),(20,4,'::1','Chrome 149','Windows 10','FAILED','2026-07-05 17:17:04'),(21,4,'::1','Chrome 149','Windows 10','FAILED','2026-07-05 17:24:09'),(22,4,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-05 17:26:14'),(23,4,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-05 18:01:09'),(24,NULL,'::1','Chrome 149','Windows 10','FAILED','2026-07-05 18:15:20'),(25,4,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-05 18:16:28'),(26,NULL,'::1','Chrome 149','Windows 10','FAILED','2026-07-05 18:18:48'),(27,2,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-05 19:52:34'),(28,4,'::1','Chrome 149','Windows 10','SUCCESS','2026-07-06 04:57:55');
/*!40000 ALTER TABLE `login_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(500) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (19,1,'618f19b6839a5ddcfb57905bb2c91c5a22a2717687d39fe2e1c872b83f356dcbf4277ec64db19e20c195eb8849da0c75be99ab292cbb078a985cd8e6b9ddfc32','2026-07-12 13:41:23','2026-07-05 08:11:22'),(35,2,'22501b2253674f1c4da4982581fe70df54ec596437161342aadee717bb05af45410e412601b72137deaf8ed01c8a3462866aeb6d6e98730f0ee62096182c238e','2026-07-13 01:22:35','2026-07-05 19:52:34');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `two_factor_enabled` tinyint(1) DEFAULT '0',
  `two_factor_secret` varchar(255) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `email_verification_token` varchar(255) DEFAULT NULL,
  `failed_attempts` int DEFAULT '0',
  `lock_until` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ayush Pratap Singh','singhpratapayush2004@gmail.com','$2b$12$EwvNvSBuSzs1dq7E4zIB5e7.SHm4SnXA.BlZ0SXg4meLsEQIXhYhu','admin',1,'2026-07-04 17:18:38','2026-07-05 08:09:39',1,'LJPHA5BQEQ2T44KQHIZGWY32O5NC4OJ4KVVSGZ2YMRRG4SJWJI5A',0,NULL,0,NULL),(2,'Leo Das','leodas2.com@gmail.com','$2b$12$3L8FtFuVVS45yEYXe5VQXOOqLagVdDGHRJAvZVNVXYp2CEu52.skO','user',1,'2026-07-04 19:46:57','2026-07-05 19:51:04',0,NULL,1,NULL,0,NULL),(4,'Sahil','hello22.com1@gmail.com','$2b$12$a5x7W4emNdsY2yaQzwib0.q56s0gEcs8Z1MLmmh8o81QIJ4tiBwca','user',1,'2026-07-05 09:02:51','2026-07-05 17:26:14',0,NULL,1,NULL,0,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-06 15:31:54
