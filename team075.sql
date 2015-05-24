/*
Navicat MySQL Data Transfer

Source Server         : iw
Source Server Version : 50541
Source Host           : stusql.dcs.shef.ac.uk:3306
Source Database       : team075

Target Server Type    : MYSQL
Target Server Version : 50541
File Encoding         : 65001

Date: 2015-05-24 20:57:28
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for keyword
-- ----------------------------
DROP TABLE IF EXISTS `keyword`;
CREATE TABLE `keyword` (
  `kwid` int(30) NOT NULL AUTO_INCREMENT,
  `userid` varchar(100) DEFAULT NULL,
  `screenname` varchar(30) DEFAULT NULL,
  `keywords` varchar(30) DEFAULT NULL,
  `url` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`kwid`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for usersinfo
-- ----------------------------
DROP TABLE IF EXISTS `usersinfo`;
CREATE TABLE `usersinfo` (
  `userid` varchar(100) NOT NULL,
  `screenname` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for venueinfo
-- ----------------------------
DROP TABLE IF EXISTS `venueinfo`;
CREATE TABLE `venueinfo` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `userid` varchar(100) DEFAULT NULL,
  `venuename` varchar(30) DEFAULT NULL,
  `venueabstract` varchar(30) DEFAULT NULL,
  `venueurl` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
