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
                //// // console.log("DED %d: 1st %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);
                this.obstaclePool.add(obstacle)
                //// // console.log("POOL ADDED %d: 1st %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);
                // console.log("In group:------------------------");
                this.obstacleGroup.getChildren().forEach(function(obstacle){
                    // console.log("%d: %d", obstacle.pit_num, obstacle.x);
                }, this);

                // console.log("In pool:+++++++++++++++++++++++++");
                this.obstaclePool.getChildren().forEach(function(obstacle){
                    // console.log("%d: %d", obstacle.pit_num, obstacle.x);
                }, this);
            }
        });
 
        // pool
        this.obstaclePool = this.scene.add.group({
            // once a obstacle is removed from the pool, it's added to the active obstacles group

            removeCallback: (obstacle) => {
                //// // console.log("DED %d: 1st %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);

                this.obstacleGroup.add(obstacle);

                // console.log("In group++++++++++++++++++++++++");
                this.obstacleGroup.getChildren().forEach(function(obstacle){
                    // console.log("%d: %d", obstacle.pit_num, obstacle.x);
                }, this);

                // console.log("In pool------------------------");
                this.obstaclePool.getChildren().forEach(function(obstacle){
                    // console.log("%d: %d", obstacle.pit_num, obstacle.x);
                }, this);
                //// // console.log("GROUP ADDED %d: 1st %d, %f, %d, %d", obstacle.pit_num, obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);
            }
        });
    }


    //Obstacle creation
    // the core of the script: obstacle are added from the pool or created on the fly
    addObstacle(posX){
        let plane =   Phaser.Math.Between(0,1);  //
        // // console.log("Adding obstacle")
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
            obstacle.x = posX;
            obstacle.setOrigin(0,0).refreshBody();
            this.obstacleGroup.add(obstacle);
        }

        obstacle.plane = plane;
        if (obstacle.plane == 0){
            obstacle.scale = 1;
            obstacle.y = this.POSITIONS[0];
            obstacle.setVelocityX(this.mole.speed*-100);
        } else {
            obstacle.scale = this.SCALE;
            obstacle.y = this.POSITIONS[1];
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
                    // console.log("Removed");
                    obstacle.x = this.spawnMax;
                    obstacle.setVelocityX(0);
                    this.obstacleGroup.killAndHide(obstacle);
                    this.obstacleGroup.remove(obstacle);
                } else if (obstacle.x > this.spawnMax) obstacle.x = this.spawnMax;
            }, this);

            console.log(minDistance, ">", this.nextObstacleDistance);
 
            // adding new obstacles
            if(minDistance >= this.nextObstacleDistance ){//&& !this.cooldown){
                this.cooldown = true;
                this.cooldownTimer.paused = false;
                this.cooldownTimer.delay = (this.cooldownTimer.delay > 300) ? this.cooldownTimer.delay - 1 : this.cooldownTimer.delay;
                let obstacle = this.addObstacle(this.spawnMax);
                
                //console.log("AFTER ADDING : 1st %d, %f, %d, %d", obstacle.y, obstacle.scale, obstacle.depth, obstacle.plane);
            }
    }

}