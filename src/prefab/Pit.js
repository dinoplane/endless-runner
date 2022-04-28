class Pit extends Enemy{
    static slots = [];
    static NUM_PITS = 0;
    
    constructor(scene, x, y, cy, scale, plane){
        super(scene, x, y, cy, scale, 'pit', plane);
        this.setOrigin(0,0).refreshBody();

        this.pit_num = Pit.NUM_PITS;
        Pit.NUM_PITS += 1;
        console.log("Pit", this.pit_num)
        console.log("After %d, %f, %d, %d", this.y, this.scale, this.depth, this.plane);
        console.log("After %d, %f, %d, %d", this.cachedData.y, this.cachedData.scale, this.cachedData.depth, +!this.plane);
    }
}
