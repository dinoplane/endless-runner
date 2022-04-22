class Pit extends Enemy{
    constructor(scene, x, y){
        super(scene, x, y, 'pit', 0);

        this.respawnTimer = scene.time.addEvent({
            delay: 5000, // ms
            callback: this.spawn,
            callbackScope: this,
            loop: true
        });
        this.refreshBody();
    }

    spawn(){
        this.respawnTimer.pause = true;
        super.spawn()
    }

    reset(){
        super.reset();
        this.respawnTimer.pause = false;
    }
}
