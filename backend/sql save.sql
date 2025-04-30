-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 29 avr. 2025 à 14:03
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `renault`
--

-- --------------------------------------------------------

--
-- Structure de la table `groupes`
--

DROP TABLE IF EXISTS `groupes`;
CREATE TABLE IF NOT EXISTS `groupes` (
  `id_groupe` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `couleur` varchar(30) NOT NULL,
  `nb_membre` int NOT NULL,
  PRIMARY KEY (`id_groupe`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `groupes`
--

INSERT INTO `groupes` (`id_groupe`, `name`, `couleur`, `nb_membre`) VALUES
(10, 'équipe de Gab', '#03e251', 2),
(11, 'encore', '#e12323', 3);

-- --------------------------------------------------------

--
-- Structure de la table `groupe_membres`
--

DROP TABLE IF EXISTS `groupe_membres`;
CREATE TABLE IF NOT EXISTS `groupe_membres` (
  `id_groupe` int NOT NULL,
  `id_membre` int NOT NULL,
  PRIMARY KEY (`id_groupe`,`id_membre`),
  KEY `fk_membre` (`id_membre`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `groupe_membres`
--

INSERT INTO `groupe_membres` (`id_groupe`, `id_membre`) VALUES
(6, 8),
(6, 9),
(7, 17),
(7, 18),
(8, 19),
(10, 17),
(10, 20),
(11, 17),
(11, 18),
(11, 20);

-- --------------------------------------------------------

--
-- Structure de la table `membres`
--

DROP TABLE IF EXISTS `membres`;
CREATE TABLE IF NOT EXISTS `membres` (
  `id_membre` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id_membre`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `membres`
--

INSERT INTO `membres` (`id_membre`, `name`) VALUES
(18, 'k'),
(17, 'anne'),
(20, 'test');

-- --------------------------------------------------------

--
-- Structure de la table `taches`
--

DROP TABLE IF EXISTS `taches`;
CREATE TABLE IF NOT EXISTS `taches` (
  `id_tache` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(30) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `niveau` int NOT NULL,
  `deadline` date NOT NULL,
  `nb_condition_ok` int NOT NULL,
  `nb_condition_total` int NOT NULL,
  `terminée` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_tache`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `taches`
--

INSERT INTO `taches` (`id_tache`, `nom`, `description`, `niveau`, `deadline`, `nb_condition_ok`, `nb_condition_total`, `terminée`) VALUES
(1, 'Nouvelle tâche', '', 2, '2025-05-10', 0, 0, 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
