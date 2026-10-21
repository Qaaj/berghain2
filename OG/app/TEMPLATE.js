
var TEMP = function(game,obj) {

    this.game = game;
    this.physics = game.physx;

    // UPDATE and EVENT signals
    this.game.update_signal.add(this.update,this);
    this.game.event_signal.add(this.eventHandler,this);
    
    // ADD OBJECT TO STAGE
    this.target = this.game.add.sprite(32, _game.world.height - 150, 'dude')

    // Disable smoothing
    this.target.smoothed = false;

    //  We need to enable physics on the player
    this.physics.enable(this.target)

    //  Our two animations, walking left and right.
    this.target.animations.add('left', [1, 2], 10, true);
    this.target.animations.add('right', [6, 7], 10, true)

    //  Player physics properties. Give the little guy a slight bounce.
    this.target.body.bounce.y = 0.2;
    this.target.body.gravity.y = 300;
    this.target.body.collideWorldBounds = true;

    return this;
}

TEMP.prototype.eventHandler = function(event){
    
    if(event.name == ""){
 
    }
}


  
TEMP.prototype.update = function(obj) {
    this.updatePhysics(obj);
    this.updatePosition(obj);
}

TEMP.prototype.updatePhysics = function(obj){
   // PHYSX: Check colission with env
    this.physics.collide(this.target, obj.env);
}

TEMP.prototype.updatePosition = function(obj) {

    var cursors = obj.cursors;
    
    this.target.body.velocity.x = 0;

    if (cursors.left.isDown) {
        this.target.body.velocity.x = -150;
        this.target.animations.play('left');
    } else if (cursors.right.isDown) {
       this.target.body.velocity.x = 150;
       this.target.animations.play('right');
    } else {
        this.target.animations.stop();
        this.target.frame = 4;
    }

}