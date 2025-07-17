DROP TABLE IF EXISTS `posts`;

CREATE TABLE `posts` (
  `id` varchar(36) NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` varchar(256) NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
