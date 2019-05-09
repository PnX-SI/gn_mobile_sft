=========
CHANGELOG
=========

0.2.0 (2019-05-09)
------------------

Deuxième version de l'appli mobile GeoNature (protocole Suivi flore territoire) , piloté par le PNE, développée par @rorp24. 

Prototype fonctionnel, auquel il manque l'envoi de données dans la base, et des filtres de recherche.

**Fonctionnalités**

* Possibilité pour l'utilisateur de se connecter à l'API 
* Paramètres de l'application
* Récupération de données en ligne pour une utilisation hors ligne
* Utilisation en mode hors ligne
* Formulaire de saisie
* Stockage en local des insertions de données
* Auto-détection d'une ZP proche
* Affichage continue de la position pendant la visite

**A venir**

* Ecriture dans la base
* Recherche par paramètres des ZP

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
