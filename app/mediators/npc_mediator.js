(function(berghain2) {

    'use strict';

    berghain2.NPCMediator = function(target, game, dispatcher, lo, input, npc_model, config) {

        var NPC_LIST = ["smoker", "weirdo", "cop"];

        this.target = target;
        
        this.doAction = function(action) {
            if (action == "Keep your distance") {
                target.frame = 3;
            }
        }


        if (target.name == "") // if no name given, create a random NPC
        {
            target.name = NPC_LIST[Math.floor(Math.random() * NPC_LIST.length)];
            lo.g("MEDIATOR", "NPC mediator instantiated without type. Random type assigned: " + target.name, target);
        } else {
            lo.g("MEDIATOR", "NPC mediator instantiated with type: " + target.name, target);
        }

        switch (target.name) {

            case "smoker":
                target.frame = 0;
                break;

            case "weirdo":
                target.frame = 1;
                break;

            case "cop":
                target.frame = 2;
                break;
        }



        dispatcher.dispatch("register_interactable_background_object", {
            type: "npc." + target.name,
            x: target.x - 50,
            width: target.width + 50,
            npc: this
        });

        var handleGameUpdate = function(event) {

        }

        var handleGameRender = function(event) {
            // if (config.debug) game.debug.body(target);
        }

        // dispatcher.addEventListener('game_update', handleGameUpdate);
        // dispatcher.addEventListener('game_render', handleGameRender);

        var destroy = function() {
            console.log("NPC mediator is rekt");
            // dispatcher.removeEventListener('game_update', handleGameUpdate);
            // dispatcher.removeEventListener('game_render', handleGameRender);
        }

        target.events.onDestroy.add(destroy, this);
    };





})(window.berghain2 = window.berghain2 || {});