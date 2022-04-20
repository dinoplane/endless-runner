
var config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 720,
    scene: [Play],
    physics: {
      default: 'arcade',
      arcade: {
           debug: true 
      }
    }
  }




var game = new Phaser.Game(config);

let controls;
