class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame, mole){
        super(scene, x, y, texture, frame);

        // add object to existing scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.visible = false;
        this.mole = mole;


        this.respawnTimer = scene.time.addEvent({
            delay: 5000, // ms
            callback: this.spawn,
            //args: [],
            callbackScope: this,
            loop: true
        });

        console.log(this.body);
        this.setOrigin(0,0);
        this.setBounce(1,1);
        this.setCollideWorldBounds(true);
        this.refreshBody();
    }

    handleCollision(){

    }

    spawn(){

        this.visible = true;
        this.setVelocity(-600, 0);
    }

    reset(){
        this.visible = false;
    }
}