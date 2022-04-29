class Gem extends Enemy{  
    static TYPES = [];
    
    constructor(scene, x, y, cy, scale, texture, value = 2000, plane){
        console.log("I came here")

        if (texture == "") super(scene, x, y, cy, scale, 'gem', plane);
        else super(scene, x, y, cy, scale, texture, plane);

        // this.respawnTimer = scene.time.addEvent({
        //     delay: 5000, // ms
        //     callback: this.spawn,
        //     callbackScope: this,
        //     loop: true
        // });
        this.value = value;
        this.refreshBody();
    }

    spawn(){
        //this.respawnTimer.paused = true;
        this.setVelocityX(-300);
    }

    reset(){
        this.x = game.config.width;
        this.setVelocityX(0);
        //this.respawnTimer.paused = false;
    }
}
