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
    "commands/show_player_notification_command",
    "commands/create_backdrop_command",
    "commands/camera_target_command",
    "commands/create_backdrop_command",
    "commands/camera_target_command",
    "commands/player_interact_with_backdrop",
    "commands/player_death_command",
    "commands/create_building_command",
    "commands/init_physics_command",
    "commands/create_player_command",
 
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
    "models/player_notification_model",
    "models/game_model",
    "models/text_model",
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
    "states/player/player_inside",
    "states/input/input_normal",
    "states/input/input_topdown",

// OTHER
    "util/log",
    "util/config",
    "util/random"
],

    function (
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
        show_player_notification_command,
        create_backdrop_command,
        camera_target_command,
        player_interact_with_backdrop,
        player_death_command,
        create_building_command,
        init_physics_command,
        create_player_command,
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
        player_notification_model,
        game_model,
        text_model,
        npc_model,
        //VO
        message_vo,
        message_type,
        // INTERFACES
        input_interface,    
        // STATES
        app_boot,
        app_playing,
        player_ground_state,
        player_jump_state,
        player_zombie_state,
        player_inside_state,
        input_normal_state,
        input_topdown_state,
        // STATES
        app_boot,
        app_playing,
        app_in_building,
        app_in_ubahn,
 
        // OTHER
        log,
        config,
        random
        ) {

        (function (berghain2, soma) {

            'use strict';

            var Berghain2 = soma.Application.extend({   


                constructor: function (element) {
                    this.element = element;
                    soma.Application.call(this);
                },
                init: function () {

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
                    this.commands.add("show_player_notification", berghain2.ShowPlayerNotificationCommand);
                    this.commands.add("player_notification_tween_completed", berghain2.ShowPlayerNotificationCommand);
                    this.commands.add("create_backdrop", berghain2.CreateBackdropCommand);
                    this.commands.add("camera_target", berghain2.CameraTargetCommand);
                    this.commands.add("player_interact_with_backdrop", berghain2.PlayerInteractWithBackdropCommand);
                    this.commands.add("player_death", berghain2.PlayerDeathCommand);
                    this.commands.add("create_building", berghain2.CreateBuildingCommand);
                    this.commands.add("init_physics", berghain2.InitPhysicsCommand);
                    this.commands.add("create_player", berghain2.CreatePlayerCommand);
                    // Model
                    this.injector.mapClass('state_model', berghain2.StateModel, true);
                    this.injector.mapClass('player_model', berghain2.PlayerModel, true);
                    this.injector.mapClass('physics_model', berghain2.PhysicsModel, true);
                    this.injector.mapClass('message_model', berghain2.MessageQueModel, true);
                    this.injector.mapClass('game_model', berghain2.GameModel, true);
                    this.injector.mapClass('camera_model', berghain2.CameraModel, true);
                    this.injector.mapClass('npc_model', berghain2.NPCModel, true);
                    this.injector.mapClass('player_notification_model', berghain2.PlayerNotificationModel, true);
                   
                    this.injector.mapClass('text_model', berghain2.TextModel, true);
                },
                start: function () {

                    this.dispatcher.dispatch('start_application', { generator: seedrandom });

                }
            });

            var berghain2 = new Berghain2(document.querySelector('.berghain2-app'));



        })(window.berghain2 = window.berghain2 || {}, soma);


    });
