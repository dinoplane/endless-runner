
var config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 720,
    scene: [Menu, Play],
    physics: {
      default: 'arcade',
      arcade: {
           debug: true 
      }
    }
  }

  


var game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
  let borderPadding = borderUISize / 3;

let controls;
let keyF, keyR, keyLEFT, keyRIGHT, keySPACE, keyUP;
