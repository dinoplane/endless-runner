
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
  spawnRange: [config.width/2, config.width*1.1],
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


// Spawning taken from 
// https://www.emanueleferonato.com/2018/11/13/build-a-html5-endless-runner-with-phaser-in-a-few-lines-of-code-using-arcade-physics-and-featuring-object-pooling/
