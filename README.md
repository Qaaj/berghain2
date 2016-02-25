# README #


### What is this repository for? ###

* Berghain2.com - THE GAME!

* Version 0.1

* Doc with ideas at https://docs.google.com/document/d/1BwV3h55eOatf0nTIxCOrz5LlpF0ImkBqtb9kZEixW-M/edit


### How do I get set up? ###

**Setting Up:**

 - Pull/Fetch repo
 - $ cd *repo directory* 
 - $ php -S localhost:9200
 - In the browser, go to http://localhost:9200

**Dependencies**

We use the following JS Libs:

**RequireJS - http://requirejs.org/**

RequireJS manages the imports of the classes used in our project. Since we use SOMA.js, we only have to import them once, in **main.js**

When you add a new JS class file, please import it. You can do this as follows. (**main.js - line 8**)

> define(
> [    
>    "commands/start_application_command"
> ], 
> 
> function
> (
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

*listening*

> dispatcher.addEventListener('event', function(event) {});

If you don't have access to the dispatcher object, add it in the constructor class. SOMAjs will handle the injection)


**Mediator**

> mediators.create(berghain2.PlayerMediator, player); 

Add a mediator for an object, in this case the Player object. To access the mediators object, just add in in the constructor of the class, SOMAjs handles the injection.
           

**Map classes (singleton)**

> this.injector.mapClass('lo', berghain2.Log, true); 

The log class. See further in the document on how to use this. Acces the "lo" class anywhere in the application by adding it in the constructor, SOMAjs handles the injections

**Map value**

> injector.mapValue("game", new Phaser.Game(..)); 

Map the game object with the name 'game'. Access the 'game' object anywhere in the application by adding it in the constructor. SOMAjs handles the injections

**Commands**

> this.commands.add("start_application",berghain2.StartApplicationCommand); 

The StartApplicationCommand will be executed when you dispatch a "start_application" event


** Phaser.IO - http://phaser.io/ ** 

Docs for PhaserIO are on http://phaser.io/docs

I personally prefer the offline version, found by downloading the github repo at https://github.com/photonstorm/phaser/tree/master/docs

You will need to setup a webserver for local access (phaser can't run through local files - Use PHP server as described for the game, on a different port)

The docs for Phaser are very clear, Actionscript-like in the way things are done. If you need help on doing something, I recommend checking out the hundreds of examples at 
http://phaser.io/examples



** The lo.g class ** 

I created a handy logger class that we can use instead of console.log(..);

- Can be enabled/disabled universally (production vs dev)
- Has custom colour codes so you can see where your trace comes from. (Mediator? Event? etc)
- You can enable/disable traces by type (e.g. Only see the logs coming from Events)
- The verbose boolean toggles long/short traces (do we want to see just text or also the objects that are traced)
- Takes a many parameters as you want (string, int, object, object, etc)

*USAGE*

- To enable the logger in the class you are working on, simply add it to the constructor and SOMAjs handles the injection, e.g.

> berghain2.StartApplicationCommand = function(dispatcher, injector, lo) { }

- To log, simply type:

> lo.g("COMMAND", "This is a trace coming from the StartApplicationCommand, "Here is some more information", {this:"is an object"});

- You can enable/disable logging in the class file, found under app/util/log.js

### Contribution guidelines ###

Please follow the code formatting used in the files. I use SublimeText with the JavaScript Beautify plugin

 - Download SublimeText
 - Install Package Control from https://packagecontrol.io/installation
 - Open SublimeText
 - CMD + SHIFT + P - "Install Packages"
 - Select Javascript Beautify to install
 - CMD + SHIFT + P - "Javascript Beautify" to run in the current file

I also created a TODO.md file. to preview Markdown files, install the "Markdown Preview" package in SublimeText:

- Install Package Control from https://packagecontrol.io/installation
 - Open SublimeText
 - CMD + SHIFT + P - "Install Packages"
 - Select Markdown Preview to install
 - CMD + SHIFT + P - "Markdown preview"

### SUBLIME shortcuts ###

- Hold down ALT and click and drag to edit multiple lines
- CMD + P is a global search function to jump to files


### Who do I talk to? ###

* jan.jorissen@gmail.com / Skype: grasmaaier45
* lander.willems@gmail.com / Skype: lander.willems
* allaert.mathieu@gmail.com / Skype: allaertm

Slack integration


* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)