class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);

        // add object to existing scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.visible = false;
        this.body.onWorldBounds = true;
        this.setCollideWorldBounds(true).refreshBody();
    }

    spawn(){
        this.visible = true;
        this.setVelocity(-600, 0);
    }

    reset(){
        this.visible = false;
        this.x = game.config.width;
    }
}