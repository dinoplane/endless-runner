
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

  // global game options
let gameOptions = {
  obstacleStartSpeed: 350,
  spawnRange: [100, config.width],
  obstacleSizeRange: [50, 250],
  playerGravity: 900,
  jumpForce: 400,
  playerStartPosition: 200,
  jumps: 2
}



var game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let controls;
let keyF, keyR, keyLEFT, keyRIGHT, keySPACE, keyUP;
