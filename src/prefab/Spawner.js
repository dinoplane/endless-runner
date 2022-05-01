class Spawner{
    static nextObstacleDistance = 0;
    constructor(scene, mole, type, spawnMin, ...args){
        this.scene = scene;
        this.WORLD_BOUNDS = this.scene.WORLD_BOUNDS;
        this.SCALE = this.scene.SCALE;
        this.POSITIONS = [args[1], args[2]];
        this.args = args;
        this.spawnMin = spawnMin;
        this.spawnMax = args[0];

        this.mole = mole;
        this.type = type;

        this.nextObstacleDistance = 0;

        this.cooldown = false;
        this.cooldownTimer = scene.time.addEvent({
            delay: this.spawnMin,
            callback: () => {
                this.cooldown = false;
                this.cooldownTimer.paused = true;
            },
            callbackScope: this,
            loop: true
        });

        // group with all active obstacles.
        this.obstacleGroup = this.scene.add.group({
            // once a obstacle is removed, it's added to the pool

            removeCallback: (obstacle) => {
                //// console.log("DED %d: 1st %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);
                this.obstaclePool.add(obstacle)
                //// console.log("POOL ADDED %d: 1st %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);

            }
        });
 
        // pool
        this.obstaclePool = this.scene.add.group({
            // once a obstacle is removed from the pool, it's added to the active obstacles group

            removeCallback: (obstacle) => {
                //// console.log("DED %d: 1st %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);

                this.obstacleGroup.add(obstacle)
                //// console.log("GROUP ADDED %d: 1st %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);
            }
        });
    }


    //Obstacle creation
    // the core of the script: obstacle are added from the pool or created on the fly
    addObstacle(posX){
        let plane =   Phaser.Math.Between(0,1);  //
        // console.log("Adding obstacle")
        let obstacle;
        if(this.obstaclePool.getLength()){
            
            obstacle = this.obstaclePool.getFirst();
            obstacle.x = posX;
            obstacle.active = true;
            obstacle.visible = true;
            obstacle.refreshBody();

            this.obstaclePool.remove(obstacle);
            obstacle.setPlane(plane);
        }
        else{
            obstacle = new this.type(this.scene, ...this.args, plane);  
            obstacle.setOrigin(0,0).refreshBody();
            this.obstacleGroup.add(obstacle);
        }

        obstacle.plane = plane;
        if (obstacle.plane == 0){
            obstacle.scale = 1;
            obstacle.y = this.POSITIONS[0].y+20;
            obstacle.setVelocityX(this.mole.speed*-100);
        } else {
            obstacle.scale = this.SCALE;
            obstacle.y = this.POSITIONS[1].y+10;
            obstacle.setVelocityX(this.mole.speed*-70);
        }
        
        this.nextObstacleDistance = Phaser.Math.Between(this.spawnMin, this.spawnMax);
        return obstacle;
    }

    onGameOver(){
        this.obstaclePool.clear();
        this.obstacleGroup.getChildren().forEach((obstacle) => {
            obstacle.onGameOver();
        });
    }

    updateSpeed(){
        this.obstacleGroup.getChildren().forEach((obstacle) => {
            obstacle.setVelocityX(this.mole.speed*-100);
        });
    }

    update(){
            // recycling obstacles
            let minDistance = this.spawnMax;
            
            this.obstacleGroup.getChildren().forEach(function(obstacle){
                let obstacleDistance = this.spawnMax - obstacle.x - obstacle.displayWidth;
                minDistance = Math.min(minDistance, obstacleDistance);
                obstacle.y = this.POSITIONS[+obstacle.plane]; 
                if(obstacle.x < - obstacle.displayWidth){
                    this.obstacleGroup.killAndHide(obstacle);
                    this.obstacleGroup.remove(obstacle);
                }
            }, this);
            
            // adding new obstacles
            if(minDistance > this.nextObstacleDistance && !this.cooldown){
                console.log(this.type, minDistance, ">", this.nextObstacleDistance);
                this.cooldown = true;
                this.cooldownTimer.paused = false;
                let obstacle = this.addObstacle(this.spawnMax);
                console.log("AFTER ADDING : 1st %d, %f, %d, %d", obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);
            }
    }

}