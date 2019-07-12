========
Documentation développeur
========

Préambule
---------

**Commandes utiles**

::

  ionic generate (ce dont on a besoin) # créé une page, un service, ou autre
  
  ionic serve # lance la version web de l’application
  
  ionic cordova build (plateforme) # build l’application pour la plateforme choisie
  
  ionic cordova run (plateforme) # build l’application pour la plateforme choisie, puis la lance sur un terminal de ladite plateforme
  
  ionic cordova ressource (plateforme) # utilise les fichiers /(dossier de l’application)/resources/icon.png et /(dossier de l’application)/resources/splash.png pour générer des icon et splash personnalisés pour l’application

Liens vers d'autre documentations utiles
----------------------------------------

`Ionic <https://ionicframework.com/docs>`_

`Leaflet <https://leafletjs.com/reference-1.4.0.html>`_

Applications sous Ionic
-----------------------

Le fichier ``/(dossier de l’application)/config.xml`` équivaut a l’androidManifest.xml sur android (a peu près)

Les variables d’environnements sont dans ``/(dossier de l’application)/src/environments/environment.ts`` et ``/(dossier de l’application)/src/environments/environment.prod.ts`` (on se s’en sert pas dans cette appli pour le moment)

Les code de l’application vont dans ``/(dossier de l’application)/src/app/`` (c’est géré automatiquement avec ionic generate)

Les assets sont dans ``/(dossier de l’application)/src/assets/`` (bon c’est évident)

Le html d’une page se met dans ``./la-page.page.html``

Le code d’une page se met dans ``./la-page.page.ts``

Les test de vérification d’une page se met dans ``./la-page.page.spec.ts``

Aides au débug de l'appli (après ionic cordova run)
---------------------------------------------------

**Débug avec la console chrome (n’affiche que les erreurs issu du JS)**

Prérequis : activer le débuggage USB sur l’appareil

1. aller sur chrome://inspect/#devices

2. lancer l’application sur l’appareil

3. cliquer sur inspect

**Débug avec Android studio (Affiche tout, mais est plus difficile a décrypter)**

1. build l’application via ionic cordova build

2. ouvrir le dossier platforms/android dans Android studio

3. lancer l’application sur l’appareil

Ouvrir la console d’android (onglet run)

Librairies
----------

**Ajouter une librairie**

Si la librairie n’implique pas d’utiliser des fonctions natives de l’appareil, un ``npm install`` suffit

Si la librairie en implique, vous devrez utiliser la commande ``ionic cordova plugin add`` (mais généralement la doc d’ionic vous dira précisément quelle commande exécuter)

**Librairies utilisées**

La liste des librairies se trouve dans le package.json

Code
----

**Appels a l'API**

::

  import {ApiService} from "../services/api.service"
  
  [code]
  
  this.ApiService.getData(forceRefresh, requeteType, id).subcribe(res =>{[code pour utiliser les données]})
  
Où ``forceRefresh`` est un booléen (par défaut a false), ``requeteType`` est un string (par défaut a "base", et ``id`` un nombre (par défaut a 0).

``res`` est le résultat de la requête, un JSON, ou, quand l’appli n’arrivais pas a lire ça proprement, un tableau de JSON, qu’on passe dans une fonction pour l’utiliser

voici le tableau des types de données renvoyés en fonction de requeteType :

+------------------+------------------------------------------------------+
| requeteType      | Résultat                                             |
+==================+======================================================+
| "base"           | Renvoi la liste des visites possibles, et les        |
|                  | données qui leurs sont relatives                     |
+------------------+------------------------------------------------------+
| "maille"         | Renvoi le géojson des mailles associé a l’id         | 
+------------------+------------------------------------------------------+
| "visite"         | Renvoi les données relative a la visite associé      |
|                  | a l’id                                               |
+------------------+------------------------------------------------------+
| "observeur"      | Renvoi tous les observateurs, et les données qui     |
|                  | leurs sont relatives                                 |
+------------------+------------------------------------------------------+
| "perturbations"  | Renvoi toutes les perturbations, et les données qui  |
|                  | leurs sont relatives                                 |
+------------------+------------------------------------------------------+
| "organisme"      | Renvoi tous les organisme, et les données qui leurs  |
|                  | sont relatives                                       |
+------------------+------------------------------------------------------+

**Vérifier la connexion a internet de l’utilisateur**

::
  
  import { NetworkService, ConnectionStatus } from "../services/network.service";

  [code]

  if(NetworkService.getCurrentNetworkStatus() == ConnectionStatus.Online)
  {
    [code]
  }
  else
  {
    [code]
  }

A terminer
----------

**Fonctionnalités**

Lecture dans la carte SD au lieu de files (en attente d’une réponse sur `cette question stack Overflow <https://stackoverflow.com/questions/56802609/cordova-diagnostic-exception-on-diagnostic-getexternalsdcarddetails>`_)

**Bugs**

