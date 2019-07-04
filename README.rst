=========
gn_mobile_sft
=========

Application mobile de saisie dans le module `GeoNature Suivi Flore Territoire <https://github.com/PnX-SI/gn_module_suivi_flore_territoire>`_

Installation
-------------

Avant de commencer, vérifiez que `Node.js et npm <https://nodejs.org/fr/>`_ sont installés et sont a jour 

::
 
    npm install -g ionic@5.1.0
  
    npm install -g cordova@9.0.0
  
    git clone git@github.com:PnX-SI/gn_mobile_sft.git
  
    cd gn_mobile_sft
  
    npm install

Lancer l'appli sur le navigateur
--------------------------------

::
 
    ionic serve

Lancer l'appli sur un terminal
------------------------------
**IOS**

Nécessite un environnement `IOS <https://ionicframework.com/docs/installation/ios>`_ seulement disponible sur MacOS 
::
 
    ionic cordova run ios

**Android**

Nécessite un environnement `Android <https://ionicframework.com/docs/installation/android>`_ disponible sur Windows, MacOS et Linux 
::
 
    ionic cordova run android

Build l'appli
-------------

**IOS**

::
 
    ionic cordova build ios

**Android**

::
 
    ionic cordova build android

Customination
-------------

**config.xml**

Modifier l'id de l'appli
::
 
    <widget id="com.geonature.sft">

Modifier la nom de l'appli
::
 
    <name>Suivi flore territoire</name>

Description de l'appli
::
 
    <description>An awesome Ionic/Cordova app.</description>

**Couleur/thème de l'appli**

Il faut modifier le fichier ``src/theme/variables.scss`` (`générateur <https://ionicframework.com/docs/theming/color-generator>`_ )

**Icone et splashscreen**

* l'image source de l'icone doit faire 1024×1024px et être localisé dans ``resources/icon.png``
* l'image source du splashscreen doit faire 2732×2732px et être localisé dans ``resources/splash.png``

Une fois fait, lancez la commande
::
 
    ionic cordova resources
