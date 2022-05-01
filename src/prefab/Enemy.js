class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, cy, scale, texture, plane){
        super(scene, x, y, texture, 0);
        
        // add object to existing scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.cachedData= {y: cy, scale: scale, depth: 3}

        this.plane = 0;
        this.depth = 6;
        this.setPlane(plane);
        this.setImmovable();
 
        this.refreshBody();
    }

    setPlane(plane){
       if (this.plane != plane){
            this.plane = plane;
            let tmp = [this.y, this.scale, this.depth]

            // Set the data
            this.depth = this.cachedData.depth;
            this.scale = this.cachedData.scale;
            this.y = this.cachedData.y;

            // // save the data
            this.cachedData.depth = tmp[2];
            this.cachedData.scale = tmp[1];
            this.cachedData.y = tmp[0];
        }   
    } 
    
    onGameOver(){
        this.setVelocityX(0);
        this.anims.stop();
    }
}