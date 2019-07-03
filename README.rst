=========
gn_mobile_sft
=========

Application mobile de saisie dans le module GeoNature Suivi Flore Territoire : https://github.com/PnX-SI/gn_module_suivi_flore_territoire

Installation
-------------
Avant de commencer, vérifiez que Node.js et npm installés et sont a jour
.. code-block::RST
  npm install -g ionic@5.1.0
  
  npm install -g cordova@9.0.0
  
  git clone git@github.com:PnX-SI/gn_mobile_sft.git
  
  cd gn_mobile_sft
  
  npm install
Lancer l'appli sur le navigateur
-------------
.. code-block::RST
  ionic serve
Lancer l'appli sur un terminal
-------------
**IOS**

Nécessite un environnement IOS seulement disponible sur MacOS (https://ionicframework.com/docs/installation/ios)
.. code-block::RST
  ionic cordova run ios
**Android**

Nécessite un environnement Android disponible sur Windows, MacOS et Linux (https://ionicframework.com/docs/installation/android)
.. code-block::RST
  ionic cordova run android
Build l'appli
-------------
**IOS**

.. code-block::RST
  ionic cordova build ios
**Android**

.. code-block::RST
  ionic cordova build android
Customination
-------------
**config.xml**

Modifier l'id de l'appli
.. code-block::RST
  <widget id="com.geonature.sft">
Modifier la nom de l'appli
.. code-block::RST
  <name>Suivi flore territoire</name>
Description de l'appli
.. code-block::RST
  <description>An awesome Ionic/Cordova app.</description>
**Couleur/thème de l'appli**

Il faut modifier le fichier src/theme/variables.scss (aide: https://ionicframework.com/docs/theming/color-generator)

**Icone et splashscreen**

* l'image source de l'icone doit faire 1024×1024px et être localisé dans resources/icon.png
* l'image source du splashscreen doit faire 2732×2732px et être localisé dans resources/splash.png

Une fois fait, lancez la commande
.. code-block::RST
  ionic cordova resources
