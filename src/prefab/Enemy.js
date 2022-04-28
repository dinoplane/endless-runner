class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, cy, scale, texture, plane){
        //console.log("Actually I'm here", texture)
        super(scene, x, y, texture, 0);
        
        // add object to existing scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.cachedData= {y: cy, scale: scale, depth: 3}

        this.plane = 0;
        this.depth = 6;
        console.log("Begin with %d, %f, %d", y, scale, plane);
        console.log("I-1 %d, %f, %d, %d", this.y, this.scale, this.depth, this.plane);
        console.log("C-1 %d, %f, %d, %d", this.cachedData.y, this.cachedData.scale, this.cachedData.depth, +!this.plane);
        this.setPlane(plane);
        console.log("I4 %d, %f, %d, %d", this.y, this.scale, this.depth, this.plane);
        console.log("C4 %d, %f, %d, %d", this.cachedData.y, this.cachedData.scale, this.cachedData.depth, +!this.plane);
        this.setImmovable();
 
        this.body.setSize(this.width - 50, this.height, true);
        this.refreshBody();
    }

    setPlane(plane){
        console.log("Plane: %d", plane)
        console.log("I0 %d, %f, %d, %d", this.y, this.scale, this.depth, this.plane);
        console.log("C0 %d, %f, %d, %d", this.cachedData.y, this.cachedData.scale, this.cachedData.depth, +!this.plane);
        if (this.plane != plane){
            this.plane = plane;
            let tmp = [this.y, this.scale, this.depth]

            // Set the data
            
            this.scale = this.cachedData.scale;
            this.depth = this.cachedData.depth;
            this.y = this.cachedData.y;
            console.log("I1 %d, %f, %d, %d", this.y, this.scale, this.depth, this.plane);
            console.log("C1 %d, %f, %d, %d", this.cachedData.y, this.cachedData.scale, this.cachedData.depth, +!this.plane);

            // // save the data
            
            this.cachedData.scale = tmp[1];
            this.cachedData.depth = tmp[2];
            this.cachedData.y = tmp[0];
            
            console.log("I2 %d, %f, %d, %d", this.y, this.scale, this.depth, this.plane);
            console.log("C2 %d, %f, %d, %d", this.cachedData.y, this.cachedData.scale, this.cachedData.depth, +!this.plane);
        }
        console.log("I3 %d, %f, %d, %d", this.y, this.scale, this.depth, this.plane);
        console.log("C3 %d, %f, %d, %d", this.cachedData.y, this.cachedData.scale, this.cachedData.depth, +!this.plane);        
    } 
    
    onGameOver(){
        this.setVelocity(0);
        this.anims.stop();
    }
}