// Refactor code so that we use arcade sprite instead.

class Mole extends Phaser.Physics.Arcade.Sprite {
    //POSITIONS = config;
    static MAX_OFFSET = 150;
    constructor(scene, x, y, cx, cy, scale, texture, frame) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.cachedData= {x: cx, y:cy, scale: scale}
    
        this.speed = 5;
        this.offset = 0;
        this.plane = 0;
        this.centers = [x, cx]
        this.inBackground = false;
        this.hits = 3;

        this.setCollideWorldBounds(true);

        this.keySwitch = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keySwitch.on('down', (key, event) => {
            this.switchPlanes();
        });
        this.setPushable(true);
        
        this.keyRIGHT = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyLEFT = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.keyRIGHT.on('down', (key) => {
            this.setVelocity(150, 0);
        });

        this.keyRIGHT.on('up', (key) => {
            this.setVelocity(0);
        });

        this.keyLEFT.on('down', (key) => {
            this.setVelocity(-150, 0);
        });

        this.keyLEFT.on('up', (key) => {
            this.setVelocity(0);
        });

        //Invisible barriers are set in Play
        
    }

    update(){

    }

    switchPlanes(){
        console.log(this.plane);
        console.log(this.cachedData)
        var tmp = [this.centers[+this.plane], this.y, this.scale];
        this.plane = !this.plane;
        console.log(tmp);
        this.x = this.cachedData.x;
        this.y = this.cachedData.y;
        this.scale = this.cachedData.scale;
        this.cachedData.x = tmp[0];
        this.cachedData.y = tmp[1];
        this.cachedData.scale = tmp[2];
    }
}