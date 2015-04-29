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

When you add a new JS class file, please import it. You can do this as follows.

*define([    
    "commands/start_application_command"
], 

function(
    start_application_command,
{
*

This will import the StartApplicationCommand class. First line points to the file location, second is a name we give to the import.

* Database configuration
* How to run tests
* Deployment instructions

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