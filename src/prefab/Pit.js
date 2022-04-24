class Pit extends Enemy{
    static slots = [];
    
    constructor(scene, x, y, cy, scale, plane){
        super(scene, x, y, cy, scale, 'pit', plane);

        // this.respawnTimer = scene.time.addEvent({
        //     delay: 5000, // ms
        //     callback: this.spawn,
        //     callbackScope: this,
        //     loop: true
        // });
        this.refreshBody();
    }
}
