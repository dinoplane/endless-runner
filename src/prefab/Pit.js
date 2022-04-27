class Pit extends Enemy{
    static slots = [];
    
    constructor(scene, x, y, cy, scale, plane){
        super(scene, x, y, cy, scale, 'pit', plane);
        this.refreshBody();
    }
}
