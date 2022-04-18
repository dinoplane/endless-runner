// Rocket prefab
class Mole extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);

        this.speed = 5;
        this.plane = 0;
        this.hasCart = false;
        this.hasHat = false;
        
    }

    update(){
    }
}