// Refactor code so that we use arcade sprite instead.

class Mole extends Phaser.Physics.Arcade.Sprite {
    //POSITIONS = config;
    static MAX_OFFSET = 150;
    static ACCEL = 600;

    constructor(scene, x, y, cx, cy, scale, texture, frame) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.cachedData= {x: cx, y:cy, scale: scale}
    
        this.origy = y;
        this.depth = 7;
        this.speed = 5;
        this.plane = false;
        this.centers = [x, cx]
        this.hits = 3;
        this.score = 0;
        this.gameOver = false;
        this.switching = false;

        this.setMaxVelocity(150, 0);
        this.setDrag(300);
        

        this.speedTimer = scene.time.addEvent({
            delay: 30000,
            callback: () => {
                this.speed += 1;
                this.scene.updateSpeed();
            },
            callbackScope: this,
            loop: true
        })

        // Animations
        this.run = this.anims.create({
            key: 'run',
            frames:  this.anims.generateFrameNumbers('mole', { start: 0, end: 8, first: 0}),
            frameRate: this.speed*10,
            repeat: -1
        });
        this.play('run');



        // Controls
        this.keySwitch = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keySwitch.on('down', (key, event) => {
            if (!this.switching && !this.gameOver){
                this.switching = true;
                this.switchPlanes();
            }
        });
        
        this.setPushable(true).setDepth(3);
        
        this.keyRIGHT = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyLEFT = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        // Add other controls.

        this.keyRIGHT.on('down', (key) => {
            if (!this.gameOver){
                this.setAcceleration(Mole.ACCEL, 0);
                this.run.frameRate = this.speed*20;
                this.play('run');
            }
        });

        this.keyRIGHT.on('up', (key) => {
            if (!this.gameOver){
                if (!this.keyLEFT.isDown){
                    this.setAcceleration(0, 0);
                    this.run.frameRate = this.speed*10;
                } else {
                    console.log("right is up!")
                    this.setAcceleration(-Mole.ACCEL, 0);
                    this.run.frameRate = this.speed*5;
                }
                this.play('run');
            }
        });

        this.keyLEFT.on('down', (key) => {
            if (!this.gameOver){
                this.setAcceleration(-Mole.ACCEL, 0);
                this.run.frameRate = this.speed*5;
                this.play('run');
            }
        });

        this.keyLEFT.on('up', (key) => {
            if (!this.gameOver){
                if (!this.keyRIGHT.isDown){
                    this.setAcceleration(0, 0);
                    this.run.frameRate = this.speed*10;
                } else {
                    this.setAcceleration(Mole.ACCEL, 0);
                    this.run.frameRate = this.speed*20;
                };
                this.play('run');
            }
        });

        //Invisible barriers are set in Play
    }

    update(){
        //console.log("my depth!", this.depth)
        this.score += this.speed;        
    }

    onGameOver(){
        this.gameOver = true;
        this.visible = false;
    }

    tweenStart(){
        //REmove Collision
    }

    switchPlanes(){ // basically a swap for 3 values but using tweens.
        //Tweens
        this.frontToBack = this.scene.tweens.create({
            targets: this,
            x: this.x + 100,
            y: this.cachedData.y,
            scale: this.cachedData.scale,
            duration: 250,
            ease: 'Cubic.easeInOut',
            easeParams: [ 3.5 ],
            //delay: 1000,
            onStart: (target) => {this.setImmovable(true);},
            onComplete: (target) => {
                this.setImmovable(false);
                this.switching = false;
                this.plane = 1;
            },
            onUpdate: () => {  },
            paused: true
        });

        this.backToFront = this.scene.tweens.create({
            targets: this,
            x: this.x - 100,
            y: this.origy,
            scale: 1,
            duration: 250,
            ease: 'Cubic.easeInOut',
            easeParams: [ 3.5 ],
            //delay: 1000,
            onStart: (target) => {
                this.setImmovable(true);
            },
            onComplete: (target) => { 
                this.setImmovable(false); 
                this.switching = false;
                this.plane = 0;
            },
            onUpdate: () => {  },
            paused: true
        });
        
        this.transitions = [this.frontToBack, this.backToFront]


        //var tmp = [this.centers[+this.plane], this.y, this.scale];

        
        console.log("Before start: ", this.transitions[+this.plane].data[0].start);
        console.log("Before end: ", this.transitions[+this.plane].data[0].end);
        

        
        this.transitions[+this.plane].data[0].start = this.x;
        this.transitions[+this.plane].updateTo('x', this.x + 450);

        console.log("After start: ", this.transitions[+this.plane].data[0].start);

        console.log("After end: ", this.transitions[+this.plane].data[0].end);
        
        this.transitions[+this.plane].play();
    }


}