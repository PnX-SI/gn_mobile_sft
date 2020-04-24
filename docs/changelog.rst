=========
CHANGELOG
=========

1.0.0 (2019-07-19)
------------------

Quatrième version de l'appli mobile GeoNature (protocole Suivi flore territoire), pilotée par le PNE et le CBNA, développée par @rorp24. 

**Fonctionnalités**

* Accélération de l'application
* Lecture sur carte SD et fichiers locaux
* Documentation développeur (V2)
* Documentation utilisateur (V1)
* Mise à jour de l'interface

0.3.0 (2019-06-18)
------------------

Troisième version de l'appli mobile GeoNature (protocole Suivi flore territoire), pilotée par le PNE et le CBNA, développée par @rorp24. 

Prototype opérationnel permettant l'envoi de données dans la BDD.

**Fonctionnalités**

* Compatibilité avec la version 9 d'Android
* Mise en place des filtres de recherche
* Possibilité d’envoyer des données à l’API
* Synchronisation totale de l’application et de l'API
* Documentation développeur (V1)
* Documentation utilisateur (V0.1)

0.2.0 (2019-05-09)
------------------

Deuxième version de l'appli mobile GeoNature (protocole Suivi flore territoire), pilotée par le PNE et le CBNA, développée par @rorp24. 

Prototype fonctionnel, auquel il manque l'envoi de données dans la BDD, et les filtres de recherche.

Démo vidéo : https://geonature.fr/docs/img/2019-05-SFT-mobile-0.2.0.gif

.. image :: img/screenshots-0-2-0.png

**Fonctionnalités**

* Possibilité pour l'utilisateur de s'authentifier à l'API 
* Paramètres de l'application sous forme de fichier, éditable aussi dans l'application
* Récupération de données en ligne depuis l'API pour une utilisation hors ligne (stockage local)
* Saisie en mode hors ligne fonctionnel (stockage local)
* Développement du formulaire de saisie
* Auto-détection d'une ZP proche de la position GPS
* Localisation continue de la position GPS pendant la visite
* Utilisation de mbtiles pour la carto hors ligne (pour l'instant limité à des fichiers de 20Mo)

**A venir**

* Synchronisation et écriture dans la BDD
* Filtre et recherche des ZP
* Documentation

0.1.0 (2019-03-15)
------------------

Première version fonctionelle de l'application mobile GeoNature du module Suivi flore territoire, développée par @rorp24.

Prototype minimal n'incluant que l'affichage des données.

.. image :: img/screenshots-0-1-0.jpg

**Fonctionnalités**

* Connexion à l'API du module GeoNature pour récupérer les données (http://demo.geonature.fr/geonature)
* Affichage des sites sur la carte Leaflet et dans une liste
* Selection d'un site, recentrage sur celui-ci et affichage de ses mailles
* Localisation automatique sur la position GPS du terminal

**A venir**

* Authentification utilisateur pour les routes protégées de l'API (écriture notamment)
* Formulaire simplifié de saisie de visites (présence/absence du taxon sur les mailles du site)
* Implémentation des filtres des sites
* Mise en place de paramètres de l'application (URL API, centrage carte...)
* Récupération de données en ligne pour une utilisation hors ligne
* Utilisation en mode hors ligne et synchronisation des données
* Affichage des fonds de carte hors-ligne stockés sur la carte SD (mbtiles)
* Documentation
