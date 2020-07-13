class Trajectory {

  constructor(num) {
    var orbit = orbits[num];
    this._radius = orbit.radius;
    this._center = orbit.center;
    //this._speed = speed;
    this._rotVector = orbit.rotVector;
    this._semiYAxes = orbit.semiYAxes;
    this._alpha = orbit.alpha;
      
    if (orbit.semiYAxes === undefined) {
        this._currX = this._radius * Math.cos(this._alpha);
        this._currY = this._radius * Math.sin(this._alpha);
    }
    else {
        this._currX = this._radius * Math.cos(this._alpha);
        this._currY = this._semiYAxes * Math.sin(this._alpha);
    }
    this._constOrbit = trajConst * Math.pow(orbit.radius, -3/2) * Math.pow(this.dist(), 2);
  }

  get radius(){
    return this._radius;
  }

  get center(){
    return this._center;
  }

  /*get speed(){
    return this._speed;
  }*/

  get rotVector(){
    return this._rotVector;
  }
    
  get alpha(){
    return this._alpha;
  }
    
  get semiYAxes(){
      return this._semiYAxes;
  }
    
  get constOrbit(){
    return this._constOrbit;
  }


  set radius(radius){
    this._radius = radius;
  }

  set center(center){
    this._center = center;
  }

  /*set speed(speed){
    this._speed = speed;
  }*/

  updateAlpha(deltaAlpha){
      this._alpha += deltaAlpha;
  }
    
  dist(){
      return Math.sqrt(Math.pow(this._currX, 2) + Math.pow(this._currY, 2));
  }

  gibePos(){
      
      var positions = [];
      var currVector = [];
      //sphere
      if (this._semiYAxes === undefined){
            // computing position on the XY plane, following a circular trajectory
            this._currX = this._radius * Math.cos(this._alpha);
            this._currY = this._radius * Math.sin(this._alpha);
            var currZ = 0.0;
            var currW = 1.0;

            currVector = [this._currX, this._currY, currZ, currW];
      }
      //ellipse
      else{
            // computing position on the XY plane, following an elliptical trajectory
            this._currX = this._radius * Math.cos(this._alpha);
            this._currY = this._semiYAxes * Math.sin(this._alpha);
            var currZ = 0.0;
            var currW = 1.0;

            currVector = [this._currX, this._currY, currZ, currW];
      }
      // applying the transformations to obtain the position in the given
      // plane
      var transform = utils.MakeRotateXMatrix(this._rotVector[0]);
      transform = utils.multiplyMatrices(utils.MakeRotateYMatrix(this._rotVector[1]), transform);
      transform = utils.multiplyMatrices(utils.MakeTranslateMatrix(this._center[0], this._center[1], this._center[2]), transform);
      var nextPos = utils.multiplyMatrixVector(transform, currVector);
      positions.push(nextPos);
      return positions;
  }

}

const trajConst = 0.05;
const scale = 0.5;

const orbit0 = {
    radius: 8*scale,
    center: [0, 0, 0],
    rotVector: [90, 0],
    alpha: 0
}

const orbit1 = {
    radius: 8*scale,
    center: [0, 0, 0],
    rotVector: [0, 0],
    alpha: Math.PI
}

const orbit2 = {
    radius: 12*scale,
    center: [0, 0, 0],
    rotVector: [45, 0],
    alpha: 0
}

const orbit3 = {
    radius: 12*scale,
    center: [0, 0, 0],
    rotVector: [-45, 0],
    alpha: Math.PI
}

const orbit4 = {
    radius: 18*scale,
    center: [4*scale, 0, 0],
    rotVector: [90, 0],
    alpha: 0,
    semiYAxes: 12*scale
}

const orbit5 = {
    radius: 18*scale,
    center: [-4*scale, 0, 0],
    rotVector: [0, 0],
    alpha: Math.PI,
    semiYAxes: 12*scale
}

const orbit6 = {
    radius: 18*scale,
    center: [0, 0, -4*scale],
    rotVector: [0, 90],
    alpha: 0,
    semiYAxes: 12*scale
}

const orbit7 = {
    radius: 18*scale,
    center: [0, 0, 4*scale],
    rotVector: [90, 90],
    alpha: Math.PI,
    semiYAxes: 12*scale
}


const orbits = [
    orbit0, orbit1, orbit2, orbit3, orbit4, orbit5, orbit6, orbit7
]
