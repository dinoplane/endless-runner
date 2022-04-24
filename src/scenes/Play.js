class Play extends Phaser.Scene {
    static OBSTACLE_TYPE = ["pit", "bat"];
    constructor(){
        super("playScene");
    }

    preload(){
        this.load.image('cave_wall', './assets/background.png');
        this.load.image('gem', './assets/gem.png');
        this.load.image('cave_front', './assets/ground_front.png');
        this.load.image('cave_back', './assets/ground_back.png');
        this.load.image('i_wall', './assets/i_wall.png');
        this.load.image('pit', './assets/pit.png');
        this.load.spritesheet('mole', './assets/mole.png', {frameWidth: 128, frameHeight: 128, startFrame: 0, endFrame: 8});
        this.load.spritesheet('bat', './assets/bat.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 6});
    }

    create(){
        this.gameOver = false;
        
        this.POSITIONS = [{x: game.config.width/4,       y: 2.7*game.config.height/4},
                          {x: 2.0*game.config.width/4,   y: 2.1*game.config.height/4}]
        this.SCALE = 0.6;
        this.WORLD_BOUNDS = {min: -game.config.width/2, max: 6*game.config.width/4}

        //this.physics.world.setBounds(this.WORLD_BOUNDS.min, 0, this.WORLD_BOUNDS.max, game.config.height);
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, highScore);
        this.scoreRight = this.add.text(game.config.width - 100-2*(borderUISize - borderPadding), borderUISize + borderPadding*2, distance);

        this.cave_wall = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cave_wall')
                                .setOrigin(0, 0).setDepth(0);
        this.cave_back = this.add.tileSprite(0, this.POSITIONS[1].y, game.config.width, 2.7*game.config.height/4, 'cave_back')
                                .setOrigin(0,0).setDepth(1);
        this.cave_front = this.add.tileSprite(0, this.POSITIONS[0].y, game.config.width, 2.7*game.config.height/4, 'cave_front')
                                .setOrigin(0,0).setDepth(5);

        this.bat = new Bat(this, this.WORLD_BOUNDS.max, this.POSITIONS[0].y, this.POSITIONS[1].y, this.SCALE, 1)
                                .setOrigin(0,0).setDepth(6);
       
        this.mole = new Mole(this, this.POSITIONS[0].x, this.POSITIONS[0].y,
                                   this.POSITIONS[1].x, this.POSITIONS[1].y, 
                                   this.SCALE, 'mole', 0).setDepth(7);

                                   this.anims.create({
                                    key: 'flap',
                                    frames: this.anims.generateFrameNumbers('bat', { start: 0, end: 6, first: 0}),
                                    frameRate: 15
                                }); this.bat.play('flap');
                                   
        //Invisble barriers for mole
        // var drag_walls = this.physics.add.staticGroup();
        // var rdrag_walls = this.physics.add.staticGroup();
        // let f = 0;
        // for (let pos of this.POSITIONS){
        //     //console.log("Pos: ", pos)
        //     let j = (f == 1) ? this.SCALE: 1;
        //     //console.log("J: ", j)
        //     for (let i = -1; i < 2; i += 2){
        //         drag_walls.create(pos.x + i * Mole.MAX_OFFSET * j, pos.y, 'i_wall').setImmovable();
        //         rdrag_walls.create(pos.x + i * (Mole.MAX_OFFSET - 50) * j, pos.y, 'i_wall').setImmovable();
        //     }
        //     f += 1;
        // }
        // this.physics.add.overlap(this.mole, drag_walls, this.handleDrag);
        // this.physics.add.overlap(this.mole, rdrag_walls, this.resetDrag);
        //this.minDepth = drag_walls.depth;

        // Create dynamic obstacles
        //Group of pits
        this.pitGroup = this.add.group();

        // group with all active obstacles.
        this.obstacleGroup = this.add.group({
            // once a obstacle is removed, it's added to the pool
            removeCallback: function(obstacle){
                obstacle.scene.obstaclePool.add(obstacle)
            }
        });
 
        // pool
        this.obstaclePool = this.add.group({
            // once a obstacle is removed from the pool, it's added to the active obstacles group
            removeCallback: function(obstacle){
                obstacle.scene.obstacleGroup.add(obstacle)
            }
        });

        this.objectGroups = {pit: this.pitGroup}

        this.addObstacle(game.config.height - this.POSITIONS[0].y, this.game.config.width, 0);

       // Debugging tool
       var cursors = this.input.keyboard.createCursorKeys();

       var controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 1.0
        };
        controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.keyR.on('down', (key) => {
           console.log("bruh", this.gameOver);
           if (this.gameOver) this.scene.restart();
        }); 
       
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF)
                            .setOrigin(0, 0).setDepth(9);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF)
                            .setOrigin(0, 0).setDepth(9);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF)
                            .setOrigin(0, 0).setDepth(9);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF)
                            .setOrigin(0, 0).setDepth(9);


        
        //this.physics.add.overlap(this.mole, this.obstacleGroup);
       this.physics.add.overlap(this.mole, this.obstacleGroup,this.handlePits);
       //this.physics.world.on('worldbounds', this.onWorldBounds);
    }

    //Obstacle creation
    // the core of the script: obstacle are added from the pool or created on the fly
    addObstacle(obstacleWidth, posX, plane){

        plane =  this.getRandomInt(2);
        console.log("HOHOHOHOHHOHOHOHOHOHOO");
        let obstacle;
        if(this.obstaclePool.getLength()){
            //console.log(ppp);
            obstacle = this.obstaclePool.getFirst();
            obstacle.x = posX;
            obstacle.active = true;
            obstacle.visible = true;
            obstacle.refreshBody();
            
            this.obstaclePool.remove(obstacle);
        }
        else{
            console.log("im y!: ", this.POSITIONS[plane]);
            obstacle = new Pit(this, posX, this.POSITIONS[plane].y, this.POSITIONS[+!plane].y, this.SCALE, plane);  
            //let s =  (game.config.height - obstacle.y) / obstacle.width;
            obstacle.setOrigin(0,0).refreshBody();
            this.obstacleGroup.add(obstacle);
        }
        obstacle.plane = plane;
        if (obstacle.plane == 0){
            obstacle.y = this.POSITIONS[0].y;
            obstacle.depth = 6;
            obstacle.scale = 1;
        }
        else {
            obstacle.y = this.POSITIONS[1].y;
            obstacle.depth = 3;
            obstacle.scale = this.SCALE;
        }
        obstacle.setVelocityX(this.mole.speed*-100);

        console.log("Plane, y, depth: ", obstacle.plane, obstacle.y, obstacle.depth)
        this.nextObstacleDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }

    updateSpeed(){
        this.obstacleGroup.getChildren().forEach((obstacle) => {
            obstacle.setVelocityX(this.mole.speed*-100);
        });
    }

    // Collision Callbacks
    onWorldBounds(body){
        console.log(body.gameObject);
        body.gameObject.reset();
        
    }

    handlePits(mole, pit){
        if (mole.plane == pit.plane && !mole.switching){
            console.log("AAAAAAA")
            mole.onGameOver();
            mole.scene.gameOver = true;
            console.log(this.gameOver)
        }
    }

    handleDrag(mole, drag){
        mole.setDrag(600);
        mole.setAcceleration(0);
        console.log("helo")
    }

    resetDrag(mole, drag){
        mole.setDrag(0);
        console.log("reset drag")
    }

    update(time, delta){
        
        if (!this.gameOver){
            this.cave_wall.tilePositionX += this.mole.speed;
            this.cave_front.tilePositionX += this.mole.speed;
            this.cave_back.tilePositionX += this.mole.speed/2;
            this.mole.update();
            controls.update(delta);
            distance++;

            // recycling obstacles
            let minDistance = this.WORLD_BOUNDS.max;
            this.obstacleGroup.getChildren().forEach(function(obstacle){
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
                ; //console.log("Im I!:",i);
                //console.log(this.POSITIONS);
                this.addObstacle(nextObstacleWidth, this.WORLD_BOUNDS.max, this.getRandomInt(2));
            }
            this.bat.update();
            highScore+=distance;
            this.scoreLeft.text=highScore;
            this.scoreRight.text=distance;
        }
    }

    getRandomInt(max = 0) {
        return Math.floor(Math.random() * max);
    }

    getRandomInt(min=0, max = 0) {
        return min + Math.floor(Math.random() * (max - min));
    }

}