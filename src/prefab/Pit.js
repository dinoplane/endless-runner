class Pit extends Enemy{
    static slots = [];
    static NUM_PITS = 0;
    
    constructor(scene, x, y, cy, scale, plane){
        super(scene, x, y, cy, scale, 'pit', plane);
        this.setOrigin(0,0).refreshBody();

        this.pit_num = Pit.NUM_PITS;
        Pit.NUM_PITS += 1;

        this.body.setSize(this.width - 50, this.height, true);
    }
}
