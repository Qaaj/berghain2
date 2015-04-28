
/// BERGHAIN2.COM

// Please install Javascript Beautify for Sublime or follow JS conventions

// ADD NEW CLASSES HERE, REQUIRE JS WILL AUTOMAGICALLY LOAD THEM

define([    
    // LIBS
    "lib/soma.min",
    "lib/phaser.min",
    // COMMANDS
    "commands/start_application",
    // MEDIATORS
    "mediators/test",
    // OTHER
    "util/log",
    "util/config"
], 

function(
    // LIBS
    Soma,
    phaser,
    // COMMANDS
    start_application_command,
    // MEDIATORS
    test_mediator,
    // OTHER
    log,
    config
    ) 
{

    (function(berghain2, soma) {

    'use strict';

    var Berghain2 = soma.Application.extend({


        constructor: function(element) {
            this.element = element;
            soma.Application.call(this);
        },
        init: function() {

            // Misc class
            this.injector.mapClass('lo', berghain2.Log, true);
            this.injector.mapClass('config', berghain2.Config, true);

            // Commands
            this.commands.add("start_application",berghain2.StartApplication)

            // Model
            // E.G. this.injector.mapClass('content_model', anatomy.ContentModel, true);

            // Mediator
            this.mediators.create(berghain2.TestMediator, {text:"Testing"});

            // Views
            // E.G this.createTemplate(anatomy.MenuView, this.element.querySelector('.soma-menu'));
          


        },
        start: function() {

            this.dispatcher.dispatch('start_application');
        }
    });

    var berghain2 = new Berghain2(document.querySelector('.berghain2-app'));



})(window.berghain2 = window.berghain2 || {}, soma);


});
