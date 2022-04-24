class Bat extends Enemy{
    static slots = [];
    
    constructor(scene, x, y, cy, scale, plane){
        super(scene, x, y, cy, scale, 'bat', plane);

        // this.respawnTimer = scene.time.addEvent({
        //     delay: 5000, // ms
        //     callback: this.spawn,
        //     callbackScope: this,
        //     loop: true
        // });
        this.moveSpeed=5;
        this.refreshBody();
    }
    update(){
        this.x-=this.moveSpeed;
        if(this.x<=0-this.width){
            this.reset();
        }
    }
    reset(){
        this.x=game.config.width;
    }
}