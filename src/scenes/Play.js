class Play extends Phaser.Scene {
    static OBSTACLE_TYPE = ["pit", "bat"];

    static GEM_VAL_TEXTURE = {2000 : "gem", 5000: "gem_red", 8000: "gem_grn"}; // Play.


    constructor(){
        super("playScene");
    }

    preload(){

        this.load.image('cave_wall', './assets/background.png');

        this.load.image('gem', './assets/gem.png');
        this.load.image('gem_red', './assets/gem_red.png');
        this.load.image('gem_grn', './assets/gem_grn.png');

        this.load.image('cave_front', './assets/ground_front.png');
        this.load.image('cave_back', './assets/ground_back.png');
        this.load.image('i_wall', './assets/i_wall.png');
        this.load.image('pit', './assets/pit.png');

        this.load.spritesheet('molecart', './assets/molecart.png', {frameWidth: 128, frameHeight: 128, startFrame: 0, endFrame: 8});
        this.load.spritesheet('molehat', './assets/molehat.png', {frameWidth: 128, frameHeight: 128, startFrame: 0, endFrame: 8});
        this.load.spritesheet('molenude', './assets/molenude.png', {frameWidth: 128, frameHeight: 128, startFrame: 0, endFrame: 8});
        this.load.spritesheet('bat', './assets/bat.png', {frameWidth: 128, frameHeight: 64, startFrame: 0, endFrame: 6});
    }

    create(){
        this.gameOver = false;
        this.ended=false;
        
        this.POSITIONS = [{x: game.config.width/4,       y: 2.7*game.config.height/4},
                          {x: 2.0*game.config.width/4,   y: 2.1*game.config.height/4}]

        console.log(this.POSITIONS)
        this.SCALE = 0.6;
        this.WORLD_BOUNDS = {min: -game.config.width/2, max: 3*game.config.width}

        this.bgMusic = this.sound.add('bgMusic');
        this.bgMusic.loop = true;
        this.bgMusic.play();

        //this.physics.world.setBounds(this.WORLD_BOUNDS.min, 0, this.WORLD_BOUNDS.max, game.config.height);
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, highScore);
        this.scoreRight = this.add.text(game.config.width -2*(borderUISize - borderPadding), borderUISize + borderPadding*2, distance);

        this.cave_wall = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cave_wall')
                                .setOrigin(0, 0).setDepth(0);
        this.cave_back = this.add.tileSprite(0, this.POSITIONS[1].y, game.config.width, 2.7*game.config.height/4, 'cave_back')
                                .setOrigin(0,0).setDepth(1);
        this.cave_front = this.add.tileSprite(0, this.POSITIONS[0].y, game.config.width, 2.7*game.config.height/4, 'cave_front')
                                .setOrigin(0,0).setDepth(5);



        this.mole = new Mole(this, this.POSITIONS[0].x, this.POSITIONS[0].y,
                                   this.POSITIONS[1].x, this.POSITIONS[1].y, 
                                   this.SCALE, 'molecart', 0).setDepth(7);
        //console.log("BATS");
        this.bat = new Bat(this, this.WORLD_BOUNDS.max, this.POSITIONS[0].y - 100, this.POSITIONS[1].y - 40, 1, 0)
                                   .setOrigin(0,0).setDepth(6);
        this.physics.add.overlap(this.mole, this.bat, (mole, bat) => {this.handleBats(mole, bat);});
                                   
        //Invisble barriers for mole
        var i_walls = this.physics.add.staticGroup();
        var mole_bounds = [borderUISize, game.config.width-borderUISize];
        for (let pos of mole_bounds)
            i_walls.create(pos, 360, 'i_wall').setImmovable().setOrigin(0,0);
        this.physics.add.collider(this.mole, i_walls);

        // Create dynamic obstacles
        //Group of pits
        //this.pitGroup = this.add.group();

        // group with all active obstacles.
        this.obstacleGroup = this.add.group({
            // once a obstacle is removed, it's added to the pool
            removeCallback: function(obstacle){
                console.log("DED %d: 1st %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);

                obstacle.scene.obstaclePool.add(obstacle)
                console.log("POOL ADDED %d: 1st %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);

            }
        });
 
        // pool
        this.obstaclePool = this.add.group({
            // once a obstacle is removed from the pool, it's added to the active obstacles group
            removeCallback: function(obstacle){
                console.log("DED %d: 1st %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);

                obstacle.scene.obstacleGroup.add(obstacle)
                console.log("GROUP ADDED %d: 1st %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);

            }
        });

        //this.objectGroups = {pit: this.pitGroup}

        this.nextObstacleDistance = 0;

        this.physics.add.overlap(this.mole, this.obstacleGroup, (mole, pit) => {this.handlePits(mole, pit);});

        // gem
        this.gem = new Gem(this, this.WORLD_BOUNDS.max, this.POSITIONS[0].y, this.POSITIONS[1].y, 1,'gem', 0);
        this.gem.setVelocityX(-400);

        
        // // group with all active obstacles.
        // this.obstacleGroup = this.add.group({
        //     // once a obstacle is removed, it's added to the pool
        //     removeCallback: function(obstacle){
        //         obstacle.scene.obstaclePool.add(obstacle)
        //     }
        // });
 
        // // pool
        // this.obstaclePool = this.add.group({
        //     // once a obstacle is removed from the pool, it's added to the active obstacles group
        //     removeCallback: function(obstacle){
        //         obstacle.scene.obstacleGroup.add(obstacle)
        //     }
        // });

        // this.objectGroups = {pit: this.pitGroup}

        // this.nextObstacleDistance = 0;

        //this.physics.add.overlap(this.mole, this.gem, this.handleGems);

        this.physics.add.overlap(this.mole, this.gem, this.handleGems);

        //this.addObstacle(game.config.height - this.POSITIONS[0].y, this.game.config.width, 0);

    //    // Debugging tool
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
           if (this.gameOver) 
                this.scene.restart();
                this.ended=false;
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
        fontFamily: 'mysoul',
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

    //Obstacle creation
    // the core of the script: obstacle are added from the pool or created on the fly
    addObstacle(obstacleWidth, posX, plane){
        //plane =  this.getRandomInt(2);  //
        console.log("Adding obstacle")
        let obstacle;
        if(this.obstaclePool.getLength()){
            
            obstacle = this.obstaclePool.getFirst();
            console.log("Pit %d: 1st %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);
        console.log("1stC %d, %f, %d, %d", obstacle.cachedData.y, obstacle.cachedData.scale, obstacle.cachedData.depth, +!obstacle.plane);
        
            obstacle.x = posX;
            obstacle.active = true;
            obstacle.visible = true;
            obstacle.refreshBody();
            console.log("Pit %d: 2nd %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);
        console.log("2ndC %d, %f, %d, %d", obstacle.cachedData.y, obstacle.cachedData.scale, obstacle.cachedData.depth, +!obstacle.plane);
        
            this.obstaclePool.remove(obstacle);
            obstacle.setPlane(plane);
            console.log("Pit %d: 3rd %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);
        console.log("3rdC %d, %f, %d, %d", obstacle.cachedData.y, obstacle.cachedData.scale, obstacle.cachedData.depth, +!obstacle.plane);
        
        }
        else{
            console.log("Plane", !plane)
            obstacle = new Pit(this,
                                 posX,
                                  this.POSITIONS[0].y,
                                   this.POSITIONS[1].y,
                                    this.SCALE,
                                     +plane);  
            //let s =  (game.config.height - obstacle.y) / obstacle.width;
            obstacle.setOrigin(0,0).refreshBody();
            this.obstacleGroup.add(obstacle);
        }

        console.log("Pit %d: FINAL %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);
        console.log("CINAL %d, %f, %d, %d", obstacle.cachedData.y, obstacle.cachedData.scale, obstacle.cachedData.depth, +!obstacle.plane);
        // obstacle.plane = plane;
        // if (obstacle.plane == 0){
        //     obstacle.y = this.POSITIONS[0].y;
        //     obstacle.depth = 6;
        //     obstacle.scale = 1;
        // }
        // else {
        //     obstacle.y = this.POSITIONS[1].y;
        //     obstacle.depth = 3;
        //     obstacle.scale = this.SCALE;
        // }
        obstacle.setVelocityX(this.mole.speed*-100);
        this.nextObstacleDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
        return obstacle;
    }

    updateSpeed(){
        this.obstacleGroup.getChildren().forEach((obstacle) => {
            obstacle.setVelocityX(this.mole.speed*-100);
        });
    }

    // Collision Callbacks
    onWorldBounds(body){
        body.gameObject.reset();
    }

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
        this.gameOver = true;
        this.bgMusic.stop();
        this.mole.onGameOver();
        this.obstacleGroup.getChildren().forEach((obstacle) => {
            obstacle.onGameOver();
        });
        this.bat.onGameOver();
        // Stop all the obstacles
    }
    
    handleGems(mole, gem){
        if (mole.plane == gem.plane && !mole.switching){
            mole.updateScore(gem.value);
            gem.reset();
        }
    }

    handleDrag(mole, drag){
        mole.setDrag(600);
        mole.setAcceleration(0);
    }

    resetDrag(mole, drag){
        mole.setDrag(0);
    }

    update(time, delta){
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE))
            this.scene.start("menuScene");

        if (!this.gameOver){
            this.cave_wall.tilePositionX += this.mole.speed;
            this.cave_front.tilePositionX += this.mole.speed;
            this.cave_back.tilePositionX += this.mole.speed/2;
            this.mole.update();
            this.scoreLabel.text = this.mole.score;
            //controls.update(delta);
            distance++;

            // recycling obstacles
            let minDistance = this.WORLD_BOUNDS.max;
            this.obstacleGroup.getChildren().forEach(function(obstacle){
                if (obstacle.y == 518) console.log("WARNING Pit %d", obstacle.pit_num)
                //obstacle.y = 486; // Gets  offset by 160 for some reason???
                let obstacleDistance = this.WORLD_BOUNDS.max - obstacle.x - obstacle.displayWidth;
                minDistance = Math.min(minDistance, obstacleDistance);
                if(obstacle.x < - obstacle.displayWidth){
                    this.obstacleGroup.killAndHide(obstacle);
                    this.obstacleGroup.remove(obstacle);
                }
            }, this);
        
            // adding new obstacles
            if(minDistance > this.nextObstacleDistance){
                var nextObstacleWidth = Phaser.Math.Between(gameOptions.obstacleSizeRange[0], gameOptions.obstacleSizeRange[1]);
                let obstacle = this.addObstacle(nextObstacleWidth, this.WORLD_BOUNDS.max, Phaser.Math.Between(0,1));
                console.log("AFTER ADDING %d: 1st %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);

            }
            this.bat.update();
            highScore+=distance;
            this.scoreLeft.text=highScore;
            this.scoreRight.text=distance;
        }else if(this.ended==false){
            //play death animation
            //stop all actions
            this.ended=true;
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Game Over').setOrigin(0.5).setDepth(10);;
            this.add.text(game.config.width/2, game.config.height/2 + 96, 'Press (R) to Restart or ← for Menu').setOrigin(0.5).setDepth(10);
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