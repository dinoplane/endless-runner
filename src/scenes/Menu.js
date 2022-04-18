class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    preload(){
        this.load.spritesheet('mole', './assets/mole.png', {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 1});
    }

    create(){
        this.mole = new Mole(this, game.config.width/4, 2.8*game.config.height/4, 'mole', 0);

    }
}