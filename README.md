# MOUSE AND KEYBOARD ACTIONS LIBRARY POC
Proof Of Concept for Docapost Agility

Librairie pouvant faire cohabiter divers éléments comme :

* L'utilisation du click droit
* L'utilisation de Ctrl + click
* Le fait de pouvoir Drag'n'Drop
* Le fait de pouvoir gérer la sélection multiple


## Requirements
* rollUp JS  ```npm install --global rollup```
* python
* ruby

## Installation
* Installer sass``` sudo su -c "gem install sass" ```

## Launch
* CSS watcher if needed, launch the first time to create the dist css file ``` yarn watch-css ```
* Launch to build the js main file ``` yarn run build-js ```
* ``` python -m SimpleHTTPServer ```

### Right click

### Drag & drop
Documents and folders as ```<li>```

The container as ```<ul>``` with ```id="folder"``` for the folders container and ```id="document"``` for the documents container
Usage of draggable and droppable component from jQuery UI

### Ctrl + click

### Multiple selection