(function(berghain2) {

    'use strict';

    var PhysicsModel = function(dispatcher, input, lo, config, game) {

        lo.g("MODEL", "Physics Model Initiated");

        // Variables
        this.environment = {};

        // Properties
        var _player = {};
        Object.defineProperty(this, "player", {

            get: function player() {
                return _player;
            },

            set: function player(value) {
                _player = value;

                dispatcher.dispatch("init_physics", value);
            },

            configurable: true,
            enumerable: false
        });

        this.interactable = {};

        // Player physics
        this.player_jump_allowed = true;

        // Helper variables
        this.ground_height = 64;
        this.interactable_background_objects = [];

        // Helper functions
        var that = this;

        this.makeImmovable = function(target) {
            // lo.g("PHYSICS","Making object immovable: " + target.name)
            game.physics.enable(target, Phaser.Physics.ARCADE);

            target.body.immovable = true;
            target.body.allowGravity = false;
            target.body.collideWorldBounds = false;
        }

        dispatcher.addEventListener('register_interactable_background_object', function(event) {
            that.interactable_background_objects.push(event.params);
        });

        this.reset = function() {
            this.environment = {};
            this.player = {};
            
            this.interactable_background_objects = [];
        }

    };

    berghain2.PhysicsModel = PhysicsModel;

})(window.berghain2 = window.berghain2 || {});