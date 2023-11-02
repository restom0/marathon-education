-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 28, 2023 at 03:58 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project1`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat_tbl`
--
CREATE TABLE `users`(
	id INT(11) PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL 
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `chat_tbl` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `bot_response` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_tbl`
--

INSERT INTO `chat_tbl` (`id`, `user_id`, `question`, `bot_response`, `created_at`, `updated_at`) VALUES
(354, 1, 'hi', 'Hello friend ! Nice to see you', '2023-10-28 13:47:43', NULL),
(355, 1, 'chào', 'Chào bạn! Tôi là chatbot', '2023-10-28 13:47:46', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `responses`
--

CREATE TABLE `responses` (
  `id` int(11) NOT NULL,
  `questions` text NOT NULL,
  `response` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `responses`
--

INSERT INTO `responses` (`id`, `questions`, `response`, `created_at`, `updated_at`) VALUES
(11, 'I love you | Tôi yêu bạn', 'I love you too', '2023-09-30 12:47:46', '2023-10-10 14:01:26'),
(13, 'mấy tuổi | may tuoi | Bạn mấy tuổi | bạn mấy tuổi | Ban may tuoi | ban may tuoi | bn may tuoi | Bn may tuoi', 'Tôi 2 tuổi', '2023-10-10 13:32:27', '2023-10-10 13:54:01'),
(14, 'Chào | chào | chào bạn | Chào bạn | chào bn | Chào bn | Có ai ở đó không | có ai ở đó không | Có ai ở đó ko | có ai ở đó ko', 'Chào bạn! Tôi là chatbot', '2023-10-10 13:50:05', '2023-10-10 13:50:05'),
(15, 'Khỏe không | khỏe không | khỏe ko | khoe ko', 'Tôi là chat bot ! Tôi luôn luôn khỏe', '2023-10-10 13:50:57', '2023-10-10 13:50:57'),
(16, 'Cafe | cafe | cafe sao | Cafe sao | Cafe thế nào | cafe thế nào', 'Cafe rất ngon', '2023-10-10 13:51:52', '2023-10-10 13:52:42'),
(17, 'Ai đẹp trai nhất', 'Trai lớp CODI  ! Oh Yeah', '2023-10-10 13:55:16', '2023-10-10 13:55:16'),
(18, 'How are u | How are you | How re u | How re you |how are u | how are you | how re u | how re you |', 'Im fine, thanks', '2023-10-10 13:56:41', '2023-10-10 13:56:41'),
(19, 'Hi | Hello', 'Hello friend ! Nice to see you', '2023-10-10 13:57:02', '2023-10-10 13:57:02'),
(21, 'ở đâu | Ở đâu | Bạn ở đâu | bạn ở đâu | bn ở đâu | Bn ở đâu', 'Tôi là chatbot vì thế tôi sống Online', '2023-10-10 13:59:22', '2023-10-10 13:59:22'),
(22, 'Ai đẹp nhất', 'Codi đẹp nhất !', '2023-10-12 13:55:33', '2023-10-12 13:55:33'),
(23, 'Tôi là ai', 'Bạn là người xinh đẹp', '2023-10-18 11:24:58', '2023-10-18 11:24:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat_tbl`
--
ALTER TABLE `chat_tbl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `responses`
--
ALTER TABLE `responses`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat_tbl`
--
ALTER TABLE `chat_tbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=356;

--
-- AUTO_INCREMENT for table `responses`
--
ALTER TABLE `responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat_tbl`
--
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
