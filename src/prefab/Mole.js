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
        this.hits = 3;
        this.score = 0;
        this.gameOver = false;

        this.run = this.anims.create({
            key: 'run',
            frames:  this.anims.generateFrameNumbers('mole', { start: 0, end: 8, first: 0}),
            frameRate: this.speed*10,
            repeat: -1
        });
        this.play('run');

        this.keySwitch = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keySwitch.on('down', (key, event) => {
            this.switchPlanes();
        });
        this.setPushable(true);
        
        this.keyRIGHT = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyLEFT = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.keyRIGHT.on('down', (key) => {
            if (!this.gameOver){
                this.setVelocity(150, 0);
                this.run.frameRate = this.speed*20;
                this.play('run');
            }
        });

        this.keyRIGHT.on('up', (key) => {
            if (!this.gameOver){
                if (!this.keyLEFT.isDown){
                    this.setVelocity(0);
                    this.run.frameRate = this.speed*10;
                } else {
                    console.log("right is up!")
                    this.setVelocity(-150, 0);
                    this.run.frameRate = this.speed*5;
                }
                this.play('run');
            }
        });

        this.keyLEFT.on('down', (key) => {
            if (!this.gameOver){
                this.setVelocity(-150, 0);
                this.run.frameRate = this.speed*5;
                this.play('run');
            }
        });

        this.keyLEFT.on('up', (key) => {
            if (!this.gameOver){
                if (!this.keyRIGHT.isDown){
                    this.setVelocity(0);
                    this.run.frameRate = this.speed*10;
                } else {
                    this.setVelocity(150, 0)
                    this.run.frameRate = this.speed*20;
                };
                this.play('run');
            }
        });

        //Invisible barriers are set in Play
    }

    update(){
        this.score += this.speed;        
    }

    onGameOver(){
        this.gameOver = true;
        this.visible = false;
    }


    switchPlanes(){ // basically a swap for 3 
        var tmp = [this.centers[+this.plane], this.y, this.scale];
        this.plane = !this.plane;

        // Set the data
        this.x = this.cachedData.x;
        this.y = this.cachedData.y;
        this.scale = this.cachedData.scale;

        // save the data
        this.cachedData.x = tmp[0];
        this.cachedData.y = tmp[1];
        this.cachedData.scale = tmp[2];
    }
}