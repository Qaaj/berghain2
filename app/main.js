
/// BERGHAIN2.COM

// Please install Javascript Beautify for Sublime or follow JS conventions

// ADD NEW CLASSES HERE, REQUIRE JS WILL AUTOMAGICALLY LOAD THEM

define([    
    // LIBS
    "lib/soma.min",
    "lib/phaser.min",
    // COMMANDS
    "commands/start_application_command",
    "commands/preload_assets_command",
    "commands/create_world_command",
    "commands/create_hud_command",
    "commands/game_object_created_command",
    "commands/init_states_command",
    // MEDIATORS
    "mediators/player_mediator",
    "mediators/game_mediator",
  
    //INTERFACES
    "interfaces/input",
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
    preload_assets_command,
    create_world_command,
    create_hud_command,
    game_object_created_command,
    init_states_command,
    // MEDIATORS
    player_mediator,
    game_mediator,
   
    //INTERFACES
    input_interface,
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
            // Startup Commands
            this.commands.add("start_application",berghain2.StartApplicationCommand);
            this.commands.add("preload_assets",berghain2.PreloadAssetsCommand);
            this.commands.add("create_world",berghain2.CreateWorldCommand);
            this.commands.add("create_hud",berghain2.CreateHudCommand);
            this.commands.add("game_object_created",berghain2.GameObjectCreatedCommand);
            this.commands.add("init_states",berghain2.InitStatesCommand);

            // Model
            // this.injector.mapClass('game_model', berghain2.GameModel, true);
            
            // Mediator
            

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
