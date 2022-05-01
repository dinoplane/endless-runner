class Bat extends Gem { // SABELEYE
    static slots = [];
    
    constructor(scene, x, y, cy, scale, plane){
        super(scene, x, y, cy, scale, 'bat',2000, plane); // See what I did here?
        
        this.respawnTimer = scene.time.addEvent({
            delay: 5000, // ms
            callback: this.spawn,
            callbackScope: this,
            loop: true
        });

        this.anims.create({
            key: 'flap',
            frames: this.anims.generateFrameNumbers('bat', { start: 0, end: 6, first: 0}),
            frameRate: 15,
            repeat: -1
        }); 
        
        this.play('flap');

        this.body.setSize(this.width - 20, this.height, true);
        this.moveSpeed=5;
        this.setVelocityX(-300);
        this.refreshBody();
    }

    update(){
        if(this.x <= 0 - this.width){
            this.reset();
        }
    }

    spawn(){
        this.respawnTimer.paused = true;
        super.spawn();
    }

    reset(){
        super.reset();
        this.respawnTimer.paused = false;
    }

    onGameOver(){
        this.respawnTimer.paused = false;
        super.onGameOver();
    }
}