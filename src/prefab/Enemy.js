class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, cy, scale, texture, plane){
        //console.log("Actually I'm here", texture)
        super(scene, x, y, texture, 0);

        // add object to existing scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.cachedData= {y:cy, scale: scale, depth: 3}

        this.plane = 0;
        this.depth = 6;
        this.setPlane(plane);
        this.setImmovable();
 
        this.body.setSize(this.width - 50, this.height, true);
        this.refreshBody();
    }

    setPlane(plane){
        console.log("I0 %d, %d, %d", this.cachedData.y, this.cachedData.scale, this.cachedData.depth);
        console.log("C0 %d, %d, %d", this.cachedData.y, this.cachedData.scale, this.cachedData.depth);
        if (this.plane != plane){
            this.plane = plane;
            let tmp = [this.y, this.scale, this.depth]

            // Set the data
            this.y = this.cachedData.y;
            this.scale = this.cachedData.scale;
            this.depth = this.cachedData.depth;
            console.log("I0.5 %d, %d, %d", this.cachedData.y, this.cachedData.scale, this.cachedData.depth);
            console.log("C0.5 %d, %d, %d", this.cachedData.y, this.cachedData.scale, this.cachedData.depth);

            // // save the data
            this.cachedData.y = tmp[0];
            this.cachedData.scale = tmp[1];
            this.cachedData.depth = tmp[2];
            console.log("I1 %d, %d, %d", this.cachedData.y, this.cachedData.scale, this.cachedData.depth);
            console.log("C1 %d, %d, %d", this.cachedData.y, this.cachedData.scale, this.cachedData.depth);
        }
        console.log("I2 %d, %d, %d", this.y, this.scale, this.depth);
        console.log("C2 %d, %d, %d", this.y, this.scale, this.depth);
        
    } 
    
    onGameOver(){
        this.setVelocity(0);
        this.anims.stop();
    }
}