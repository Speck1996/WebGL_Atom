class Atom {
    constructor(atomicNumber) {
        this._trajectories = [];
        
        this._trajectories.push(new Trajectory(0));
        
        if (atomicNumber > 1) {
            this._trajectories.push(new Trajectory(1));
        }
        
        if (atomicNumber > 2) {
            this._trajectories.push(new Trajectory(2));
            this._trajectories.push(new Trajectory(3));
            this._trajectories.push(new Trajectory(4));
            this._trajectories.push(new Trajectory(5));
        }
        
        if (atomicNumber > 6) {
            this._trajectories.push(new Trajectory(6));
            this._trajectories.push(new Trajectory(7));
        }
    }
    
    get trajectories() {
        return this._trajectories;
    }
    
    
    
    
}