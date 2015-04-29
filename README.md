# README #


### What is this repository for? ###

* Berghain2.com - THE GAME



* Version 0.1


### How do I get set up? ###

**Setting Up:**

 - Pull/Fetch repo
 - $ cd *repo directory* 
 - $ php -S localhost:9200
 - In the browser, go to http://localhost:9200

**Dependencies**

We use the following JS Libs:

**RequireJS **

Docs at http://requirejs.org/

RequireJS manages the imports of the classes used in our project. Since we use SOMA.js, we only have to import them once, in **main.js**

When you add a new JS class file, please import it. You can do this as follows. (**main.js - line 8**)

> define(
> [    
>    "commands/start_application_command"
> ], 
> 
> function(
>    start_application_command
> )

This will import the StartApplicationCommand class. First line points to the file location, second is a name we give to the import.

That's pretty much it for requirejs, since somajs handles the imports in other classes. Main advantage is we don't have to add classes in the HTML file.



** SOMA.JS ** 

Docs on http://somajs.github.io/somajs/site/

SOMA handles our dependency injection and events. 

We can add mediators, commands, map singletons and map values (instantiated variables) etc.

It's recommended to map all the commands in the main.js class

**Events**

*dispatching*

> dispatcher.dispatch('preload_assets'); 

E.G. Dispatch the preload_assets command. Listen to events or write a command to listen for it

*listening *

> dispatcher.addEventListener('event', function(event) {});

If you don't have access to the dispatcher object, add it in the constructor class. SOMAjs will handle the injection)


**Mediator**

> mediators.create(berghain2.PlayerMediator, player); 

E.G. Add a mediator for an object, in this case the Player object. To access the mediators object, just add in in the constructor of the class, SOMAjs handles the injection.
           

**Map classes (singleton)**

> this.injector.mapClass('lo', berghain2.Log, true); 

E.G. The log class. See further in the document on how to use this. Acces the "lo" class anywhere in the application by adding it in the constructor, SOMAjs handles the injections

**Map value**

> injector.mapValue("game", new Phaser.Game(..)); 

E.G. Map the game object with the name 'game'. Access the 'game' object anywhere in the application by adding it in the constructor. SOMAjs handles the injections

**Commands**

> this.commands.add("start_application",berghain2.StartApplicationCommand); 

E.G. The StartApplicationCommand will be executed when you dispatch a "start_application" event






### Contribution guidelines ###

* TODO: Tests
* TODO: Code Review
* Please follow the code formatting used in the files. I use SublimeText with the JavaScript Beautify plugin

 - Open SublimeText
 - CMD + SHIFT + P - "Install Packages"
 - Select Javascript Beautify to install
 - CMD + SHIFT + P - "Javascript Beautify" to run in the current file


### Who do I talk to? ###

* jan.jorissen@gmail.com / Skype: grasmaaier45
* lander.willems@gmail.com / Skype: lander.willems
* allaert.mathieu@gmail.com / Skype: allaertm


* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)