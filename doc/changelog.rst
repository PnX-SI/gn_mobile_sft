=========
CHANGELOG
=========

0.1.0 (2019-03-15)
------------------

Première version fonctionelle de l'application mobile GeoNature du module Suivi flore territoire, développée par @rorp24.

Prototype minimal n'incluant que l'affichage des données.

.. image :: img/screenshots-0-1-0.jpg

**Fonctionnalités**

* Interface mobile basée sur les premières versions de l'appli, et l'interface web existante
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
