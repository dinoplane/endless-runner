class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, cy, scale, texture, plane){
        super(scene, x, y, texture, 0);

        this.POSITIONS = [{x: game.config.width/4, y: 2.7*game.config.height/4},
                          {x: 2.0*game.config.width/4,   y: 2.1*game.config.height/4}]

        // add object to existing scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.cachedData= {y:cy, scale: scale, depth: 3}

        this.plane = 0;
        this.setPlane(plane);
        this.setImmovable();
    }

    setPlane(plane){
        if (plane == 0){
            this.y = this.POSITIONS[0].y;
            this.depth = 6;
            this.scale = 1;
        }
        else {
            this.y = this.POSITIONS[1].y;
            this.depth = 3;
            this.scale = this.SCALE;
        } this.plane = plane;
    } 

}