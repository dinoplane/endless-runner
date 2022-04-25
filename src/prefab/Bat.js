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


        this.anims.create({
            key: 'flap',
            frames: this.anims.generateFrameNumbers('bat', { start: 0, end: 6, first: 0}),
            frameRate: 15,
            repeat: -1
        }); 
        
        this.play('flap');

        this.body.setSize(this.width - 20, this.height, true);
        this.moveSpeed=5;
        this.refreshBody();
    }
    update(){
        this.setVelocityX(-300);
        if(this.x<=0-this.width){
            this.reset();
        }
    }
    reset(){
        this.x=game.config.width;
    }
}