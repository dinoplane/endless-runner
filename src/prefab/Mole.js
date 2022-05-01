// Refactor code so that we use arcade sprite instead.

class Mole extends Phaser.Physics.Arcade.Sprite {
    //POSITIONS = config;
    static MAX_OFFSET = 150;
    static ACCEL = 700;
    static ANIMS = [ 'molenude_run', 'molehat_run', 'molecart_run']
    static FR_MULT = [1, 2, 10];

    static CONTROL_CONFIG = [{name: 'left', arg: -Mole.ACCEL, keycodes: [Phaser.Input.Keyboard.KeyCodes.A, Phaser.Input.Keyboard.KeyCodes.LEFT], },
                       {name: 'right', arg: +Mole.ACCEL, keycodes: [Phaser.Input.Keyboard.KeyCodes.D, Phaser.Input.Keyboard.KeyCodes.RIGHT]}]

    constructor(scene, x, y, cx, cy, scale, texture, frame) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.cachedData= {x: cx, y:cy, scale: scale}

        this.origy = y;
        this.depth = 7;
        this.speed = 10;
        this.plane = false;
        this.centers = [x, cx]
        this.hits = 3;
        this.score = 0;
        this.gameOver = false;
        this.switching = false;
        this.damaged = false;

        this.setMaxVelocity(300, 0);
        this.setDrag(300);
        
        // Timers

        this.scoreTimer = scene.time.addEvent({
            delay: 1000/this.speed,
            callback: () => {
                this.score += 1;
            },
            callbackScope: this,
            loop: true
        })


        this.speedTimer = scene.time.addEvent({
            delay: 20000,
            callback: () => {
                this.crementSpeed(1);
            },
            callbackScope: this,
            loop: true
        })

        this.damageTimer = scene.time.addEvent({
            delay: 3000,
            callback: () => {
                //console.log("Im here")
                this.damaged = false;
                this.damageTimer.paused = true;
            },
            callbackScope: this,
            loop: true,
            paused: true
        })

        // Animations
        let molecart_run = this.anims.create({
            key: 'molecart_run',
            defaultTextureKey: 'mole_atlas',
            frames:  this.anims.generateFrameNames('mole_atlas', { 
                prefix: 'molecart', 
                start: 0, 
                end: 8, 
                suffix: '',
                zeroPad: 4,
                
            }),
            frameRate: this.speed*Mole.FR_MULT[2],
            repeat: -1
        });

        let molehat_run = this.anims.create({
            key: 'molehat_run',
            defaultTextureKey: 'mole_atlas',
            frames:  this.anims.generateFrameNames('mole_atlas', { 
                prefix: 'molehat',
                start: 0, 
                end: 10, 
                suffix: '',
                zeroPad: 4,
                
            }),
            frameRate: this.speed*Mole.FR_MULT[2],
            repeat: -1
        });

        let molenude_run = this.anims.create({
            key: 'molenude_run',
            defaultTextureKey: 'mole_atlas',
            frames:  this.anims.generateFrameNames('mole_atlas', { 
                prefix: 'molenude',
                start: 0, 
                end: 10, 
                suffix: '',
                zeroPad: 4,
                
            }),
            frameRate: this.speed*Mole.FR_MULT[2],
            repeat: -1
        });

        this.mole_ded = this.anims.create({
            key: 'mole_ded',
            defaultTextureKey: 'mole_atlas',
            frames:  this.anims.generateFrameNames('mole_atlas', { 
                prefix: 'explosion',
                start: 0, 
                end: 6, 
                suffix: '',
                zeroPad: 4,
            }),
            frameRate: 1,
            repeat: -1
        });

        this.moleanims = [molenude_run, molehat_run, molecart_run]

        this.anims.play(this.moleanims[this.hits - 1]);


        // Controls
        this.keySwitch = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keySwitch.on('down', (key, event) => {
            if (!this.switching && !this.gameOver){
                this.switching = true;
                this.switchPlanes();
            }
        });
        
        this.setPushable(true).setDepth(3);
        
        this.controls = [];

        this.keyRIGHT = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyLEFT = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        // Add other controls.

        for (let c of Mole.CONTROL_CONFIG){
            let d = [];
            for (let kc of c.keycodes){
                let tmpKey = this.scene.input.keyboard.addKey(kc);
                //console.log("key", kc, c.keycodes)
                tmpKey.on( 'down', (key) => {
                    this.onXDown(c.arg)
                });
                tmpKey.on('up', (key) => {
                    this.onXUp(c.arg);
                });
                d.push(tmpKey);
            }
            this.controls.push(d)
        }
        //Invisible barriers are set in Play
    }

    updateScore(val){
        this.score += val;
    }

    crementSpeed(n){
        this.speed += n;
        this.scoreTimer.delay = 1000/this.speed;
        this.scene.updateSpeed();
    }

    onXUp(a){
        if (!this.gameOver){
            let d = (a < 0) ? 1: 0;
            for (let k of this.controls[d]){
                if (!k.isDown){
                    this.setAcceleration(0, 0);
                    this.moleanims[this.hits - 1].frameRate = this.speed*Mole.FR_MULT[this.hits - 1];
                } else {
                    let d = (a < 0) ? 10: 0.2;
                    this.setAcceleration(-a, 0);
                    this.moleanims[this.hits - 1].frameRate = this.speed*Mole.FR_MULT[this.hits - 1]*d;
                    break;
                }
            }            
            this.play(Mole.ANIMS[this.hits-1]);
        }
    }

    onXDown(a){
        if (!this.gameOver){
            let d = (a < 0) ? 0.2: 10;
            this.setAcceleration(a, 0);
            this.moleanims[this.hits - 1].frameRate = this.speed*this.speed*Mole.FR_MULT[this.hits - 1]*d;
            this.play(Mole.ANIMS[this.hits-1]);
        }
    }

    takeDamage(){
        this.hits -= 1;
        this.damaged = true;

        if (this.hits == 0){
            this.onGameOver();
        } else {
            this.crementSpeed(-this.speed/4);
            this.body.setSize(this.width*3/5, this.height, true);
            this.damageTimer.paused = false;
            this.play(Mole.ANIMS[this.hits-1]);
        }
    }

    onGameOver(){
        this.anims.play('mole_ded');
        this.gameOver = true;
        this.speedTimer.paused = true;
        this.damageTimer.paused = true;
        this.scoreTimer.paused = true;
        //this.visible = false;
    }

    switchPlanes(){ // basically a swap for 3 values but using tweens.
        //Tweens
        this.frontToBack = this.scene.tweens.create({
            targets: this,
            x: (this.x > game.config.width - 1.4*this.width) ? this.x + this.width*(1-this.scale): this.x + 100,
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
                this.depth = 5;
                this.setMaxVelocity(270, 0);
            },
            onUpdate: () => {  },
            paused: true
        });

        this.backToFront = this.scene.tweens.create({
            targets: this,
            x: (this.x < this.width*1.5) ? this.x + this.width*(1-this.scale)/2: this.x - 100,
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
                this.depth = 7;
                this.setMaxVelocity(300, 0);
            },
            onUpdate: () => {  },
            paused: true
        });
        
        this.transitions = [this.frontToBack, this.backToFront]
        
        // console.log("Before start: ", this.transitions[+this.plane].data[0].start);
        // console.log("Before end: ", this.transitions[+this.plane].data[0].end);
        
        this.transitions[+this.plane].data[0].start = this.x;
        this.transitions[+this.plane].updateTo('x', this.x + 450);

        // console.log("After start: ", this.transitions[+this.plane].data[0].start);
        // console.log("After end: ", this.transitions[+this.plane].data[0].end);
        
        this.transitions[+this.plane].play();
    }

}