class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);

        // add object to existing scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.visible = false;
        this.body.onWorldBounds = true;
        this.setCollideWorldBounds(true);

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
        this.visible = true;
        this.setVelocity(-600, 0);
    }

    reset(){
        this.visible = false;
        this.x = game.config.width;
        this.respawnTimer.pause = false;
    }
}