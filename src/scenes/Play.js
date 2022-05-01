class Play extends Phaser.Scene {
    static OBSTACLE_TYPE = ["pit", "bat"];

    constructor(){
        super("playScene");
    }

    preload(){

        this.load.image('gem', './assets/gem.png');
        this.load.image('gem_red', './assets/gem_red.png');
        this.load.image('gem_grn', './assets/gem_grn.png');

        this.load.image('cave_wall', './assets/background.png');
        this.load.image('purplestones', './assets/purplestones.png');
        this.load.image('stones', './assets/stones.png');
        
        this.load.image('cave_front', './assets/ground_front.png');
        this.load.image('cave_back', './assets/ground_back.png');
        this.load.image('i_wall', './assets/i_wall.png');
        this.load.image('pit', './assets/pit.png');

        this.load.image('b0', './assets/brake_particle0.png');
        this.load.image('b1', './assets/brake_particle1.png');
        this.load.image('b2', './assets/brake_particle2.png');

        this.load.atlas('mole_atlas', './assets/mole_atlas.png', './assets/mole_atlas.json');

        this.load.spritesheet('bat', './assets/bat.png', {frameWidth: 128, frameHeight: 64, startFrame: 0, endFrame: 6});
    }

    create(){
        this.gameOver = false;
        this.ended=false;
        this.goneFar=false;
        this.POSITIONS = [{x: Math.round(game.config.width/4),       y: Math.round(2.7*game.config.height/4+10)},
                          {x: Math.round(2.0*game.config.width/4),   y: Math.round(2.1*game.config.height/4+10)}]

        console.log(this.POSITIONS)
        this.SCALE = 0.6;
        this.WORLD_BOUNDS = {min: Math.round(-game.config.width/2), max: Math.round(3*game.config.width)}

        this.bgMusic = this.sound.add('bgMusic');
        this.bgMusic.loop = true;
        this.bgMusic.play();

        this.gemCollect = this.sound.add('gem_collect');
        this.gameOverTone = this.sound.add('gameover', {volume: 0.3});

        // this.particleManager = this.add.particles('texture_key')
        // this.particleSystem = this.particleManager.createEmitter({})

        // this.particleSystem = this.particleManager.createEmitter();
        // this.particleSystem.setPosition(x, y);

        //this.physics.world.setBounds(this.WORLD_BOUNDS.min, 0, this.WORLD_BOUNDS.max, game.config.height);
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, highScore);
        this.scoreRight = this.add.text(game.config.width -2*(borderUISize - borderPadding), borderUISize + borderPadding*2, distance);
        
        this.cave_wall0 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cave_wall')
                                .setOrigin(0, 0).setDepth(0);
        this.cave_wall1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'purplestones')
                                .setOrigin(0, 0).setDepth(0);
        this.cave_wall2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'stones')
                                .setOrigin(0, 0).setDepth(0);



        this.cave_back = this.add.tileSprite(0, this.POSITIONS[1].y - 10, game.config.width, 128, 'cave_back')
                                .setOrigin(0,0).setDepth(1);
        this.cave_front = this.add.tileSprite(0, this.POSITIONS[0].y - 10, game.config.width, 128, 'cave_front')
                                .setOrigin(0,0).setDepth(5);
                                this.cave_front.setScale((game.config.height - this.cave_front.y)/this.cave_front.height);
        
                                console.log();
        this.mole = new Mole(this, this.POSITIONS[0].x, this.POSITIONS[0].y,
                                   this.POSITIONS[1].x, this.POSITIONS[1].y, 
                                   this.SCALE, 'mole_atlas', 'molecart-0000').setDepth(7);

                                   console.log("TATA");

        this.bat = new Bat(this, this.WORLD_BOUNDS.max, this.POSITIONS[0].y - 100, this.POSITIONS[1].y - 40, 1, 0)
                                   .setOrigin(0,0).setDepth(6);
        this.physics.add.overlap(this.mole, this.bat, (mole, bat) => {this.handleBats(mole, bat);});
                                   
        //Invisble barriers for mole
        let i_walls = this.physics.add.staticGroup();
        let mole_bounds = [borderUISize, game.config.width-borderUISize];
        for (let pos of mole_bounds) i_walls.create(pos, 360, 'i_wall').setImmovable().setOrigin(0,0);
        this.physics.add.collider(this.mole, i_walls);
        
        this.pitSpawner = new Spawner(this, this.mole, Pit, game.config.width,
                                                            this.WORLD_BOUNDS.max / 2,
                                                            this.POSITIONS[0].y,
                                                            this.POSITIONS[1].y,
                                                            this.SCALE);
        this.physics.add.overlap(this.mole, this.pitSpawner.obstacleGroup, (mole, pit) => {this.handlePits(mole, pit);});

        this.gemSpawner = new GemSpawner(this, this.mole, Gem, game.config.width/2,
                                                            this.WORLD_BOUNDS.max / 2,
                                                            this.POSITIONS[0].y,
                                                            this.POSITIONS[1].y,
                                                            this.SCALE,
                                                            'gem',
                                                            2000);
        this.physics.add.overlap(this.mole, this.gemSpawner.obstacleGroup, (mole, gem) => {this.handleGems(mole, gem);});

        this.spawners = [this.pitSpawner, this.gemSpawner];

        this.physics.add.overlap(this.gemSpawner.obstacleGroup, this.pitSpawner.obstacleGroup, 
                        (gem, pit) => {
                                    gem.setVelocityX(0);
                                    this.gemSpawner.obstacleGroup.killAndHide(gem);
                                    this.gemSpawner.obstacleGroup.remove(gem);
                        });

       // Debugging tool
    //    var cursors = this.input.keyboard.createCursorKeys();

    //    var controlConfig = {
    //         camera: this.cameras.main,
    //         left: cursors.left,
    //         right: cursors.right,
    //         up: cursors.up,
    //         down: cursors.down,
    //         zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
    //         zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    //         acceleration: 0.06,
    //         drag: 0.0005,
    //         maxSpeed: 1.0
    //     };
    //     controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.keyR.on('down', (key) => {
           if (this.gameOver) {
               this.goneFar=false;
                this.ended=false;
                this.scene.restart();
           }
        }); 
        // this.keyT.on('down', (key) => {
        //     if (this.gameOver) 
        //     this.scene.start("menuScene");
        //     this.ended=false;
        //  }); 
       
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF)
                            .setOrigin(0, 0).setDepth(9);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF)
                            .setOrigin(0, 0).setDepth(9);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF)
                            .setOrigin(0, 0).setDepth(9);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF)
                            .setOrigin(0, 0).setDepth(9);
                            
        //this.physics.add.overlap(this.mole, this.obstacleGroup);
       
       //this.physics.world.on('worldbounds', this.onWorldBounds);

           // display score
    let scoreConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'right',
        padding: {
        top: 5,
        bottom: 5,
        },
        fixedWidth: 100
    }
    this.scoreLabel = this.add.text(borderUISize + borderPadding, 
                                    borderUISize + borderPadding*2, this.mole.score, scoreConfig).setDepth(10);
    }


    updateSpeed(){
        this.spawners.forEach((spawner) => {spawner.updateSpeed()})
    }

    // Collision Callbacks
    // onWorldBounds(body){
    //     body.gameObject.reset();
    // }

    handleBats(mole, bat){
        // The mole needs to be on the same plane, not switching and not damaged
        if (mole.switching & !mole.damaged){
            //console.log("Owww")
            mole.takeDamage();
            if (mole.hits == 0) this.onGameOver();
        }
    }

    handlePits(mole, pit){
        console.log("%d I HIT %d, %f, %d, %d",pit.pit_num, pit.y, pit.scale, pit.depth, pit.plane);
        if (mole.plane == pit.plane && !mole.switching){
            this.onGameOver();   
        }
    }

    onGameOver(){
        this.gameOverTone.play();
        this.gameOver = true;
        this.bgMusic.pause();
        this.mole.onGameOver();
        this.spawners.forEach((spawner) => {spawner.onGameOver()})
        this.bat.onGameOver();
    }
    
    handleGems(mole, gem){
        if (mole.plane == gem.plane){
            this.gemCollect.play();
            mole.updateScore(gem.value);
            this.gemSpawner.obstacleGroup.killAndHide(gem);
            this.gemSpawner.obstacleGroup.remove(gem);
        }
    }

    handleDrag(mole, drag){
        mole.setDrag(600);
        mole.setAcceleration(0);
    }

    resetDrag(mole, drag){
        mole.setDrag(0);
    }

    update(){
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE))
            this.scene.start("menuScene");

        if (!this.gameOver){

            this.cave_wall0.tilePositionX += this.mole.speed / 4;
            this.cave_wall1.tilePositionX += this.mole.speed/3;
            this.cave_wall2.tilePositionX += this.mole.speed/2;
            
            this.cave_front.tilePositionX += this.mole.speed;
            this.cave_back.tilePositionX += this.mole.speed/2;
            //this.mole.update();
            this.scoreLabel.text = this.mole.score;
            //controls.update(delta);
            distance++;
            //this.gemSpawner.nextObstacleDistance = 0; Gem Frenzy

            this.spawners.forEach((spawner) => {spawner.update()})
            this.bat.update();

            highScore+=distance;
            this.scoreLeft.text=highScore;
            this.scoreRight.text=distance;
            
            if(!this.goneFar&&distance>=2000){
                this.gemSpawner.updateOdds(1,3,5);
                this.goneFar=true;
            }
        }else if(this.ended==false){
            //play death animation
            //stop all actions
            this.ended=true;
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Game Over').setOrigin(0.5).setDepth(10);;
            this.add.text(game.config.width/2, game.config.height/2 + 96, 'Press (R) to Restart').setOrigin(0.5).setDepth(10);
        // }else{
        //     if(Phaser.Input.Keyboard.JustDown(keyLEFT)){
        //         //maybe store a high score
        //         highScore=0;
        //         this.ended=false;
        //         this.gameOver=false;
        //         this.scene.start("menuScene");
        //     }if(Phaser.Input.Keyboard.JustDown(keyR)){
        //         //maybe store a high score
        //         highScore=0;
        //         this.ended=false;
        //         this.gameOver=false;
        //         this.scene.restart();
        //     }
        }
    }

    getRandomInt(max = 0) {
        return Math.floor(Math.random() * max);
    }

    getRandomInt(min=0, max = 0) {
        return min + Math.floor(Math.random() * (max - min));
    }

}