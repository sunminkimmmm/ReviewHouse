-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- 생성 시간: 19-05-13 08:22
-- 서버 버전: 10.1.38-MariaDB
-- PHP 버전: 7.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
CREATE DATABASE reviewHouse;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 데이터베이스: `reviewhouse`
--

-- --------------------------------------------------------

--
-- 테이블 구조 `favorite`
--

CREATE TABLE `favorite` (
  `userMail` varchar(20) NOT NULL,
  `houseIdx` varchar(20) NOT NULL,
  `favoriteCheck` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `house`
--

CREATE TABLE `house` (
  `houseIdx` int(20) NOT NULL,
  `housePic` varchar(20) DEFAULT NULL,
  `housePrice` varchar(20) DEFAULT NULL,
  `houseSpace` varchar(20) DEFAULT NULL,
  `houseComment` varchar(20) DEFAULT NULL,
  `houseAddress` varchar(20) DEFAULT NULL,
  `userMail` varchar(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `house`
--

INSERT INTO `house` (`houseIdx`, `housePic`, `housePrice`, `houseSpace`, `houseComment`, `houseAddress`, `userMail`) VALUES
(1, NULL, '10000', '45', '김선민이 올린 방', '마산', 'ksm@gmail.com'),
(2, NULL, '20000', '50', '윤다영이 올린방', '부산', 'ydy@gmail.com');

-- --------------------------------------------------------

--
-- 테이블 구조 `review`
--

CREATE TABLE `review` (
  `userMail` varchar(20) NOT NULL,
  `reviewComment` varchar(20) DEFAULT NULL,
  `houseIdx` varchar(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `review`
--

INSERT INTO `review` (`userMail`, `reviewComment`, `houseIdx`) VALUES
('sja@gmail.com', '신정아가 쓴 리뷰', '1'),
('ong@gmail.com', '오경우가 쓴 리뷰', '2'),
('sja@gmail.com', '신정아가 쓴 리뷰2', '3'),
('ong@gmail.com', '오경우가 쓴 리뷰2', '1');

-- --------------------------------------------------------

--
-- 테이블 구조 `user`
--

CREATE TABLE `user` (
  `userMail` varchar(20) NOT NULL,
  `userPassword` varchar(20) DEFAULT NULL,
  `userName` varchar(20) DEFAULT NULL,
  `userCheck` tinyint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `user`
--

INSERT INTO `user` (`userMail`, `userPassword`, `userName`, `userCheck`) VALUES
('sja@gmail.com', '1234', 'sja', 0),
('ksm@gmail.com', '1234', 'ksm', 1),
('ong@gmail.com', '1234', 'ong', 0),
('ydy@gmail.com', '1234', 'ydy', 1),
('ihj@gmail.com', '1234', 'ihj', 1),
('kdh@gmail.com', '1234', 'kdh', 0);

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `favorite`
--
ALTER TABLE `favorite`
  ADD PRIMARY KEY (`userMail`,`houseIdx`);

--
-- 테이블의 인덱스 `house`
--
ALTER TABLE `house`
  ADD PRIMARY KEY (`houseIdx`),
  ADD KEY `userMail` (`userMail`);

--
-- 테이블의 인덱스 `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`userMail`,`houseIdx`),
  ADD KEY `houseIdx` (`houseIdx`);

--
-- 테이블의 인덱스 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userMail`);

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `house`
--
ALTER TABLE `house`
  MODIFY `houseIdx` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
