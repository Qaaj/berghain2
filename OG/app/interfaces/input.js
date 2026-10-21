(function (berghain2) {

    'use strict';

    berghain2.Input = function (game, dispatcher, lo) {
        
        this.INPUT_NORMAL = new berghain2.InputNormal(game, dispatcher, lo);
        this.INPUT_TOP_DOWN = new berghain2.InputTopDown(game, dispatcher, lo);

        this.currentInput = this.INPUT_NORMAL;
        
        //public variables
        this.goLeft = false;
        this.goRight = false;
        this.goUp = false;
        this.goDown = false;
        this.sprint = false;

        this.isAnyButtonPressed = false;
        this.actionButton = false;
  
        this.update = function() {                      
            this.currentInput.update();
            
            // MOVEMENT    
            this.goLeft = this.currentInput.goLeft;
            this.goRight = this.currentInput.goRight;
            this.goUp = this.currentInput.goUp;
            this.goDown = this.currentInput.goDown;
            
            // EXTRA
            this.sprint = this.currentInput.sprint;
            this.actionButton = this.currentInput.actionButton;
            
            this.isAnyButtonPressed = this.goLeft ||  this.goRight ||  this.goUp ||  this.goDown || this.actionButton || this.sprint;
        }
    };
})(window.berghain2 = window.berghain2 || {});