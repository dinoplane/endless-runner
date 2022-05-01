// Add from asesprite
// ask whitehead about the flying ponies
//

class GemSpawner extends Spawner {

    static GEM_VAL_TEXTURE = [ 
                                [2000, 'gem'], 
                                [5000, 'gem_grn'], 
                                [8000, 'gem_red']
                            ]; // Play.
    static GEM_ODDS = [
        1, 6, 9
    ];
    

    constructor(scene, mole, type, spawnMin, ...args){
        super(scene, mole, type, spawnMin, ...args);
        
    }


        //Obstacle creation
    // the core of the script: obstacle are added from the pool or created on the fly
    addObstacle(posX){
        let gem = super.addObstacle(posX);
        let i = Phaser.Math.Between(0, GemSpawner.GEM_VAL_TEXTURE.length-1);
        let tempNum = Math.floor(Math.random() * (10))+1;
        if(tempNum>=GemSpawner.GEM_ODDS[2]){
            i=2;
        }
        else {if(tempNum>=GemSpawner.GEM_ODDS[1]){
            i=1;
        }else if(tempNum>=GemSpawner.GEM_ODDS[0]){
            i=0;
        }}
        //console.log(GemSpawner.GEM_VAL_TEXTURE.length, GemSpawner.GEM_VAL_TEXTURE[i]);
        gem.changeValue(GemSpawner.GEM_VAL_TEXTURE[i][1], GemSpawner.GEM_VAL_TEXTURE[i][0]);
        return gem;
    }
    updateOdds(blu =1, red = 6, grn=9){
        GemSpawner.GEM_ODDS[0]=blu;
        GemSpawner.GEM_ODDS[1]=red;
        GemSpawner.GEM_ODDS[2]=grn;
    }
}