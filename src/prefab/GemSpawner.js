// Add from asesprite
// ask whitehead about the flying ponies
//

class GemSpawner extends Spawner {

    static GEM_VAL_TEXTURE = [ 
                                [2000, 'gem'], 
                                [5000, 'gem_red'], 
                                [8000, 'gem_grn']
                            ]; // Play.

    constructor(scene, mole, type, spawnMin, ...args){
        super(scene, mole, type, spawnMin, ...args);
    }


        //Obstacle creation
    // the core of the script: obstacle are added from the pool or created on the fly
    addObstacle(posX){
        let gem = super.addObstacle(posX);
        let i = Phaser.Math.Between(0, GemSpawner.GEM_VAL_TEXTURE.length-1)
        console.log(GemSpawner.GEM_VAL_TEXTURE.length, GemSpawner.GEM_VAL_TEXTURE[i]);
        gem.changeValue(GemSpawner.GEM_VAL_TEXTURE[i][1], GemSpawner.GEM_VAL_TEXTURE[i][0]);
        return gem;
    }
}