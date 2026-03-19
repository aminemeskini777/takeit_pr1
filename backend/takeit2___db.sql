-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: takeit2___db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `takeit2___db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `takeit2___db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `takeit2___db`;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_02_18_132744_create_personal_access_tokens_table',1),(5,'2026_02_19_000001_add_role_status_to_users_table',2);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'auth_token','effcb8e8e3bd6da3e0313e6e6ce2e232092a96b31194268cc67404d4fe56e853','[\"*\"]',NULL,NULL,'2026-02-19 12:59:11','2026-02-19 12:59:11'),(2,'App\\Models\\User',1,'auth_token','df4cddc2ef1e5751d092687ae2fa22e6ee58fca764721f5d1bde9ae8939a1b03','[\"*\"]',NULL,NULL,'2026-02-19 12:59:48','2026-02-19 12:59:48'),(3,'App\\Models\\User',1,'auth_token','d1ca1363af3c8c44d827ca0bb565946ad552da59595c1b496c731483b26199d1','[\"*\"]',NULL,NULL,'2026-02-19 13:01:33','2026-02-19 13:01:33'),(4,'App\\Models\\User',1,'auth_token','3031a543f3d1fa0ee5633175f5b65f51f11b5612b6f15c937bb875d8db5c4def','[\"*\"]',NULL,NULL,'2026-02-22 00:51:38','2026-02-22 00:51:38'),(5,'App\\Models\\User',1,'auth_token','36d98fc661d174fa825b19e0c4bb28024e2b41c5ff9e01bd62afda37b99852b2','[\"*\"]',NULL,NULL,'2026-02-22 00:55:36','2026-02-22 00:55:36'),(6,'App\\Models\\User',1,'auth_token','e4f2eed34e90b0e353a66f05b5bcfee4f0c1cc27f956eba52eba10c138f376da','[\"*\"]',NULL,NULL,'2026-02-22 00:56:43','2026-02-22 00:56:43'),(7,'App\\Models\\User',1,'auth_token','8653865406b6b2d20f576d98da0e32269c15d2a8558dbd5ec8002d86a7a8123d','[\"*\"]',NULL,NULL,'2026-02-22 00:59:32','2026-02-22 00:59:32'),(8,'App\\Models\\User',1,'auth_token','d4df8b5b721dd6eeed7e8046a05886a5c55e86e167be7c0e1ec18539b848b7cd','[\"*\"]',NULL,NULL,'2026-02-22 01:10:11','2026-02-22 01:10:11'),(9,'App\\Models\\User',1,'auth_token','9439e876ee72de984c00fff28cec15863efae1da9d136445bf89ae82e3599060','[\"*\"]',NULL,NULL,'2026-02-22 01:12:40','2026-02-22 01:12:40'),(10,'App\\Models\\User',1,'auth_token','fbdce0bc8ba72bd6888c2a27bb8f2e78d9cbde20ecc9b2181262a97f75fb1b1f','[\"*\"]',NULL,NULL,'2026-02-22 01:25:02','2026-02-22 01:25:02'),(11,'App\\Models\\User',1,'auth_token','711fec119197aa7255dd32ee9788bd7cdb9af67217e3ea9c0d28c7625095547e','[\"*\"]',NULL,NULL,'2026-02-22 01:41:39','2026-02-22 01:41:39'),(12,'App\\Models\\User',1,'auth_token','4ceef11300016ec1e134f086fae5ca60da7ffaccc6b7b6cb6176e8394f194974','[\"*\"]',NULL,NULL,'2026-02-22 01:44:29','2026-02-22 01:44:29'),(13,'App\\Models\\User',1,'auth_token','5a153adf5ed428687cb38a98245231c3cebd105eb0aa1f5d91e456da1b8d9695','[\"*\"]',NULL,NULL,'2026-02-22 01:46:37','2026-02-22 01:46:37'),(14,'App\\Models\\User',1,'auth_token','ed8f6132c71cd64292e676ab574a7691eca8bf7979095c170a7b0149f5ba1dde','[\"*\"]',NULL,NULL,'2026-02-22 01:48:57','2026-02-22 01:48:57'),(15,'App\\Models\\User',1,'auth_token','22815a0e7c25b0f26f1cef8410eac25c54217c4b334f130ea4dcc8d8eb062d9e','[\"*\"]',NULL,NULL,'2026-02-22 02:17:37','2026-02-22 02:17:37'),(16,'App\\Models\\User',1,'auth_token','331df55af6cbb8f26395b3cc387e48b80bcb2ac7dc22f9594b41a84a2003a17f','[\"*\"]',NULL,NULL,'2026-02-23 00:43:59','2026-02-23 00:43:59'),(17,'App\\Models\\User',1,'auth_token','9f4a1de61fbe698be3456d3bba91fb1b8b128e2304b7bef95b9056150c109d49','[\"*\"]',NULL,NULL,'2026-02-23 00:44:00','2026-02-23 00:44:00'),(18,'App\\Models\\User',1,'auth_token','6c237d418c52ff82dc32b2aef7e8fd6824ab41ba47a620ce6ac82e6074569846','[\"*\"]',NULL,NULL,'2026-02-23 00:44:00','2026-02-23 00:44:00'),(19,'App\\Models\\User',1,'auth_token','8b9ae20f669f563cc54ad79581881ae0f043d65ea2b8d0ccb5056a54b810d655','[\"*\"]',NULL,NULL,'2026-02-23 00:44:01','2026-02-23 00:44:01'),(20,'App\\Models\\User',1,'auth_token','2811cd303ae66b7c904de999035734521ba60b63c59c0153f0bef50c415a2cc5','[\"*\"]',NULL,NULL,'2026-02-23 00:44:01','2026-02-23 00:44:01'),(21,'App\\Models\\User',1,'auth_token','abfe8ffea2e89b9f9d8b5dd6b7b190871003d8a5e75bc931a70e3ff757c388bd','[\"*\"]',NULL,NULL,'2026-02-23 06:36:34','2026-02-23 06:36:34'),(22,'App\\Models\\User',1,'auth_token','b1ad0bc88bfc26a64cb919a2a990379fe1a01926a1ff5c844797566f3acdadf0','[\"*\"]',NULL,NULL,'2026-02-23 07:27:07','2026-02-23 07:27:07'),(23,'App\\Models\\User',1,'auth_token','daa581ebebf29063ef6870be7bda1de3303880905f8cacd78706f0564d2a52cc','[\"*\"]',NULL,NULL,'2026-02-23 09:07:30','2026-02-23 09:07:30'),(24,'App\\Models\\User',1,'auth_token','0ada03a577f903e97d1ac79ff6f87c3a6f06d406593e3a95f0918e3a626b9349','[\"*\"]',NULL,NULL,'2026-02-23 09:07:31','2026-02-23 09:07:31'),(25,'App\\Models\\User',1,'auth_token','7d219e07a573fb4fad7cc798f0d59e579e3d5265eca7ba3c0ff21ce208a37b8c','[\"*\"]',NULL,NULL,'2026-02-23 09:07:31','2026-02-23 09:07:31'),(26,'App\\Models\\User',1,'auth_token','1b757c0a0852f0c55ec398376cff96eaba10575b3797838b76fc4985f937f4be','[\"*\"]',NULL,NULL,'2026-02-23 09:07:32','2026-02-23 09:07:32'),(27,'App\\Models\\User',1,'auth_token','835494b582be73e783a35b1ec123728e5f9b5354cae1be68e3372735dd640c58','[\"*\"]',NULL,NULL,'2026-02-23 09:50:42','2026-02-23 09:50:42'),(28,'App\\Models\\User',1,'auth_token','17edf0e9bfa41855cf04394c766c5602bc6d04805906d061681d47ed2906b292','[\"*\"]',NULL,NULL,'2026-02-23 11:29:07','2026-02-23 11:29:07'),(29,'App\\Models\\User',1,'auth_token','eeefcd82ebf40411d14a66953bac37301304b59ec6cb3993afa292815538d029','[\"*\"]',NULL,NULL,'2026-02-24 08:28:27','2026-02-24 08:28:27'),(30,'App\\Models\\User',1,'auth_token','51bacd3dfa88fb622bec010423e5b4ac78b2371afe32c3cedcb1a2bb2d101397','[\"*\"]',NULL,NULL,'2026-02-24 08:43:11','2026-02-24 08:43:11'),(31,'App\\Models\\User',1,'auth_token','be11487c7a7b097ff3faa5668ebffd6daeb66f6b33819efb39fd8e8443b36a4d','[\"*\"]',NULL,NULL,'2026-02-24 08:47:00','2026-02-24 08:47:00'),(32,'App\\Models\\User',1,'auth_token','21f4d10f7ab84a919df25b09ea3ea60fc6dac2a1a5d15e7b6afd5c02353f8cf5','[\"*\"]',NULL,NULL,'2026-02-24 09:29:49','2026-02-24 09:29:49'),(33,'App\\Models\\User',1,'auth_token','b7c03f05df6b2f89cd08755b31162ea173930989cca71186aed885f887a468c8','[\"*\"]',NULL,NULL,'2026-02-26 08:31:15','2026-02-26 08:31:15'),(34,'App\\Models\\User',1,'auth_token','b747bb2b63b103a14a5e5d47acb691408286b4dd05f9cb1c52b7402a496832bf','[\"*\"]',NULL,NULL,'2026-02-26 08:31:17','2026-02-26 08:31:17'),(35,'App\\Models\\User',1,'auth_token','52de9e375fea4664294b0be78ae9e1c430e88cf00ea4813938ae7e769b4a3e81','[\"*\"]',NULL,NULL,'2026-02-26 08:33:17','2026-02-26 08:33:17'),(36,'App\\Models\\User',1,'auth_token','cbc572a856c735d18e5a0e0f5890de89af80ade8497f59ee20aa23836810930e','[\"*\"]',NULL,NULL,'2026-02-26 08:34:00','2026-02-26 08:34:00'),(37,'App\\Models\\User',1,'auth_token','05459fea55d9adadb2ff69e766c1060616cf7fbec11c5aaf39925a46985d95bb','[\"*\"]',NULL,NULL,'2026-02-26 08:51:08','2026-02-26 08:51:08'),(38,'App\\Models\\User',1,'auth_token','95952f7c6b16732a7a3dabd93dedcf5ded5bf5a28496e33bcdb6dea265f35a12','[\"*\"]',NULL,NULL,'2026-02-26 11:18:29','2026-02-26 11:18:29'),(39,'App\\Models\\User',1,'auth_token','09df79b2fb1900af8b71529dfcd6d4cefcaff1af264459b5f05dca2039276e74','[\"*\"]',NULL,NULL,'2026-03-01 23:09:44','2026-03-01 23:09:44');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'employee',
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Amine Meskini','amine.meskini@soprahr.com','2026-02-19 12:58:16','$2y$12$Pt0F7xB9NBMh00zhhcbdRua.lHldU.TkKEn1iQsVpBQbFT7VvhoVq','manager','active','43hB3Ppih1','2026-02-19 12:58:16','2026-02-19 12:58:16');
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

-- Dump completed on 2026-03-02  1:30:38

