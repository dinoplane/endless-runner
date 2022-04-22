class Play extends Phaser.Scene {

    constructor(){
        super("playScene");
    }

    preload(){
        this.load.image('cave_wall', './assets/background.png');
        this.load.image('cave_front', './assets/ground_front.png');
        this.load.image('cave_back', './assets/ground_back.png');
        this.load.image('i_wall', './assets/i_wall.png');
        this.load.image('pit', './assets/pit.png');
        this.load.spritesheet('mole', './assets/mole.png', {frameWidth: 128, frameHeight: 128, startFrame: 0, endFrame: 8});
    }

    create(){
        this.gameOver = false;
        this.physics.world.setBounds(-game.config.width/4, 0, 8*game.config.width/4, game.config.height);

        this.POSITIONS = [{x: game.config.width/4,       y: 2.7*game.config.height/4},
                          {x: 2.0*game.config.width/4,   y: 2.1*game.config.height/4}]
        this.SCALE = 0.6;

        this.cave_wall = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cave_wall').setOrigin(0, 0);
        this.cave_back = this.add.tileSprite(0, this.POSITIONS[1].y, game.config.width, 2.7*game.config.height/4, 'cave_back').setOrigin(0,0);
        this.cave_front = this.add.tileSprite(0, this.POSITIONS[0].y, game.config.width, 2.7*game.config.height/4, 'cave_front').setOrigin(0,0);
       
        this.mole = new Mole(this, this.POSITIONS[0].x, this.POSITIONS[0].y,
                                   this.POSITIONS[1].x, this.POSITIONS[1].y, 
                                   this.SCALE, 'mole', 0);
                                   
        //Invisble barriers for mole
        var i_walls = this.physics.add.staticGroup();
        let f = 0;
        for (let pos of this.POSITIONS){
            console.log("Pos: ", pos)
            let j = (f == 1) ? this.SCALE: 1;
            console.log("J: ", j)
            for (let i = -1; i < 2; i += 2){
                i_walls.create(pos.x + i * Mole.MAX_OFFSET * j, pos.y, 'i_wall').setImmovable();
            }
            f += 1;
        }

        // Create dynamic obstacles
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

        this.addObstacle(game.config.height - this.POSITIONS[0].y, 5*this.game.config.width/8, this.POSITIONS[0].y, );


        // this.pits = [];
        // this.pits.push(new Pit(this, 5*this.game.config.width/8,
        //                                 this.POSITIONS[0].y, 
        //                                 'pit', 0)
        //                                 .setOrigin(0,0));
        // let s =  (game.config.height - this.pits[0].y) / this.pits[0].width
        // this.pits[0].setScale(s);
        // this.pits[0].refreshBody();
        
        //this.pits[0].setOrigin(0,0);

        console.log();
        // this.mole2 = new Mole(this, 2.0 *game.config.width/4, 2.1*game.config.height/4, 'mole', 0);

        //console.log("After: ", this.pits[0].y);
        //console.log(this.POSITIONS[0].y)
       
       //console.log(this.mole, this.pits[0]);
       // set velocity of enemy instead of a dumb update

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
           if (this.gameOver){
               console.log("cringe")
           

            this.scene.restart();
           }
    });

       this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
       this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
       this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
       this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);


       this.physics.add.collider(this.mole, i_walls);
       this.physics.add.overlap(this.mole, this.obstacleGroup);//this.handlePits);
       this.physics.world.on('worldbounds', this.onWorldBounds);
    }

    //Obstacle creation
    // the core of the script: obstacle are added from the pool or created on the fly
    addObstacle(obstacleWidth, posX, posY){
        let obstacle;
        if(this.obstaclePool.getLength()){
            obstacle = this.obstaclePool.getFirst();
            obstacle.x = posX;
            obstacle.y = posY;
            obstacle.active = true;
            obstacle.visible = true;
            
            this.obstaclePool.remove(obstacle);
        }
        else{
            obstacle = this.physics.add.sprite(posX, posY, "pit").setOrigin(0,0);
            let s =  (game.config.height - obstacle.y) / obstacle.width
            obstacle.setScale(s);
            obstacle.setImmovable(true);
            obstacle.setVelocityX(-600);
            obstacle.refreshBody();
            this.obstacleGroup.add(obstacle);
        }
        //obstacle.displayWidth = obstacleWidth;
        this.nextObstacleDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }

    // Collision Callbacks
    onWorldBounds(body){
        console.log(body.gameObject);
        body.gameObject.reset();
        
    }

    handlePits(mole, pit){
        console.log("AAAAAAA")
        mole.onGameOver();
        mole.scene.gameOver = true;
        console.log(this.gameOver)
    }

    update(time, delta){
        this.cave_wall.tilePositionX += this.mole.speed;
        this.cave_front.tilePositionX += this.mole.speed;
        this.cave_back.tilePositionX += this.mole.speed/2;
        this.mole.update();
        controls.update(delta);

        // recycling obstacles
        let minDistance = game.config.width;
        this.obstacleGroup.getChildren().forEach(function(obstacle){
            let obstacleDistance = game.config.width - obstacle.x - obstacle.displayWidth / 2;
            minDistance = Math.min(minDistance, obstacleDistance);
            if(obstacle.x < - obstacle.displayWidth){
                this.obstacleGroup.killAndHide(obstacle);
                this.obstacleGroup.remove(obstacle);
            }
        }, this);
    
        // adding new obstacles
        if(minDistance > this.nextObstacleDistance){
            var nextObstacleWidth = Phaser.Math.Between(gameOptions.obstacleSizeRange[0], gameOptions.obstacleSizeRange[1]);
            this.addObstacle(nextObstacleWidth, game.config.width + nextObstacleWidth / 2,this.POSITIONS[0].y);
        }
    }
}