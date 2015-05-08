/// BERGHAIN2.COM

// Please install Javascript Beautify for Sublime or follow JS conventions

// ADD NEW CLASSES HERE, REQUIRE JS WILL AUTOMAGICALLY LOAD THEM

define([
        // LIBS
        "lib/soma.min",
        "lib/phaser.min",
        "lib/seedrandom.min",
        // COMMANDS
        "commands/start_application_command",
        "commands/preload_assets_command",
        "commands/create_world_command",
        "commands/create_hud_command",
        "commands/game_object_created_command",
        "commands/init_states_command",
        "commands/show_message_command",
        "commands/create_backdrop_command",
        "commands/camera_target_command",
        "commands/player_interact_with_backdrop",
        // MEDIATORS
        "mediators/player_mediator",
        "mediators/game_mediator",
        "mediators/health_bar_mediator",
        "mediators/mana_bar_mediator",
        "mediators/fire_bin_mediator",
        "mediators/message_mediator",
        "mediators/camera_mediator",
        "mediators/npc_mediator",
        // VIEWS
        "views/health_bar_view",
        "views/message_view",
        "views/building_view",
        // MODELS
        "models/state_model",
        "models/player_model",
        "models/camera_model",
        "models/physics_model",
        "models/message_que_model",
        "models/game_model",
        "models/npc_model",
        //VO
        "models/vo/message_vo",
        // ENUMS
        "models/enums/message_type",
        // INTERFACES
        "interfaces/input",
        // STATES,
        "states/app/app_boot",
        "states/app/app_playing",
        "states/app/app_in_building",
        "states/app/app_in_ubahn",
        "states/player/player_ground",
        "states/player/player_jump",
        "states/player/player_zombie",
        // OTHER
        "util/log",
        "util/config",
        "util/random"
    ],

    function(
        // LIBS
        Soma,
        phaser,
        seedrandom,
        // COMMANDS
        start_application_command,
        preload_assets_command,
        create_world_command,
        create_hud_command,
        game_object_created_command,
        init_states_command,
        show_message_command,
        create_backdrop_command,
        camera_target_command,
        player_interact_with_backdrop,
        // MEDIATORS
        player_mediator,
        game_mediator,
        health_bar_mediator,
        mana_bar_mediator,
        message_mediator,
        camera_mediator,
        npc_mediator,
        //VIEWS
        health_bar_view,
        message_view,
        building_view,
        // MODELS
        state_model,
        player_model,
        camera_model,
        physics_model,
        message_que_model,
        game_model,
        npc_model,
        //VO
        message_vo,
        message_type,
        // INTERFACES
        input_interface,
        // STATES
        app_boot,
        app_playing,
        app_in_building,
        app_in_ubahn,
        player_ground_state,
        player_jump_state,
        player_zombie_state,
        // OTHER
        log,
        config,
        random
    ) {

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
                    this.injector.mapClass('rnd', berghain2.Random, true);



                    // ENUM Class
                    this.injector.mapClass('message_type', berghain2.MessageType, true);

                    // Commands
                    this.commands.add("start_application", berghain2.StartApplicationCommand);
                    this.commands.add("preload_assets", berghain2.PreloadAssetsCommand);
                    this.commands.add("create_world", berghain2.CreateWorldCommand);
                    this.commands.add("create_hud", berghain2.CreateHudCommand);
                    this.commands.add("game_object_created", berghain2.GameObjectCreatedCommand);
                    this.commands.add("init_states", berghain2.InitStatesCommand);
                    this.commands.add("show_message", berghain2.ShowMessageCommand);
                    this.commands.add("create_backdrop", berghain2.CreateBackdropCommand);
                    this.commands.add("camera_target", berghain2.CameraTargetCommand);
                    this.commands.add("player_interact_with_backdrop", berghain2.PlayerInteractWithBackdropCommand);


                    // Model
                    this.injector.mapClass('state_model', berghain2.StateModel, true);
                    this.injector.mapClass('player_model', berghain2.PlayerModel, true);
                    this.injector.mapClass('physics_model', berghain2.PhysicsModel, true);
                    this.injector.mapClass('message_model', berghain2.MessageQueModel, true);
                    this.injector.mapClass('game_model', berghain2.GameModel, true);
                    this.injector.mapClass('camera_model', berghain2.CameraModel, true);
                    this.injector.mapClass('npc_model', berghain2.NPCModel, true);

                },
                start: function() {

                    this.dispatcher.dispatch('start_application', {
                        generator: seedrandom
                    });

                }
            });

            var berghain2 = new Berghain2(document.querySelector('.berghain2-app'));



        })(window.berghain2 = window.berghain2 || {}, soma);


    });