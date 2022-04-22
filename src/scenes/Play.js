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
        this.load.spritesheet('mole', './assets/mole.png', {frameWidth: 128, frameHeight: 128, startFrame: 0, endFrame: 1});
    }

    create(){
        this.physics.world.setBounds(-game.config.width/8, 0, 6*game.config.width/4, game.config.height);

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
        this.physics.add.collider(this.mole, i_walls);
        

        this.pits = [];
        this.pits.push(new Enemy(this, this.game.config.width, 486 + 0*this.POSITIONS[0].y, 'pit', 0, this.mole).setOrigin(0,0));//.setOrigin(0,0));
        //this.pits[0].setOrigin(0,0);
        // this.mole2 = new Mole(this, 2.0 *game.config.width/4, 2.1*game.config.height/4, 'mole', 0);
        console.log(this.pits[0].y);
        console.log(this.POSITIONS[0].y)
       this.physics.add.collider(this.mole, this.pits[0], );
       console.log(this.mole, this.pits[0]);
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
    }

    handlePits(){

    }

    update(time, delta){
        this.cave_wall.tilePositionX += this.mole.speed;
        this.cave_front.tilePositionX += this.mole.speed;
        this.cave_back.tilePositionX += this.mole.speed/2;
        // this.pits.forEach( (pit) => {
        //     pit.update(); // show me combos
        // });
        this.mole.update();
        controls.update(delta);
    }
}