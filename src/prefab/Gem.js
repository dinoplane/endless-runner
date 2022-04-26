class Gem extends Enemy{ // What if a bat was a gemds
    static TYPES = [];
    
    constructor(scene, x, y, cy, scale, plane){
        super(scene, x, y, cy, scale, 'gem', plane);

        // this.respawnTimer = scene.time.addEvent({
        //     delay: 5000, // ms
        //     callback: this.spawn,
        //     callbackScope: this,
        //     loop: true
        // });
        this.value = 5000;
        this.refreshBody();
    }

    spawn(){
        this.setVelocityX(-300);
    }

    reset(){
        this.x = game.config.width;
        this.setVelocityX(0);
        this.respawnTimer.paused = false;
    }

}
