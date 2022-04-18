class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    preload(){
        this.load.image('cave_wall', './assets/background.png');
        this.load.spritesheet('mole', './assets/mole.png', {frameWidth: 128, frameHeight: 128, startFrame: 0, endFrame: 1});
    }

    create(){
        this.cave_wall = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cave_wall').setOrigin(0, 0);
        this.mole = new Mole(this, game.config.width/4, 2.7*game.config.height/4, 'mole', 0);

    }

    update(){
        this.cave_wall.tilePositionX += this.mole.speed;
    }
}