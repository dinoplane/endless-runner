class Mole extends Phaser.GameObjects.Sprite {
    //POSITIONS = config;
    constructor(scene, x, y, cx, cy, texture, frame) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);

        this.cachedData= {x: cx, y:cy, scale: 0.6}
    
        this.speed = 5;
        this.inBackground = false;
        this.hasCart = false;
        this.hasHat = false;

        this.keySwitch = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keySwitch.on('down', (key, event) => {
            this.switchPlanes();
        });
    }

    update(){
    }

    switchPlanes(){
        this.plane = !this.plane;
        console.log(this.plane);
        console.log(this.cachedData)
        var tmp = [this.x, this.y, this.scale];
        console.log(tmp);
        this.x = this.cachedData.x;
        this.y = this.cachedData.y;
        this.scale = this.cachedData.scale;
        this.cachedData.x = tmp[0];
        this.cachedData.y = tmp[1];
        this.cachedData.scale = tmp[2];
    }

}