class Trajectory {

  constructor(radius, center, speed, rotVector, alphaInit, numSpheres ) {
    this._radius = radius;
    this._center = center;
    this._speed = speed;
    this._rotVector = rotVector;
    this._numSpheres = numSpheres;
    this._alphas = null;
    this.assignAlphas(alphaInit);
  }

  get radius(){
    return this._radius;
  }

  get center(){
    return this._center;
  }

  get speed(){
    return this._speed;
  }

  get rotVector(){
    return this._rotVector;
  }

  get numSpheres(){
    return this._numSpheres;
  }

  get alphas(){
    return this._alphas;
  }


  set radius(radius){
    this._radius = radius;
  }

  set center(center){
    this._center = center;
  }

  set speed(speed){
    this._speed = speed;
  }

  // since there are multiple spheres on the trajectory, it computes the position
  // of each sphere starting from the initial one and dividing the angles
  // by the number of spheres
  assignAlphas(alphaInit){
    var deltaAngle = (2 * Math.PI) / this._numSpheres;

    var alphas = [];

    for (var i = 0; i < this._numSpheres; i++){
        var alpha = alphaInit + i * deltaAngle;
        alphas.push(alpha);
    }

    this._alphas = alphas;
  }

  // for each alpha it updates the current position by adding the given delta
  updateAlphas(deltaAlpha){

    for (var i = 0; i < this._alphas.length; i ++){
      this._alphas[i] += deltaAlpha;
    }

  }

  gibePos(){

      var positions = [];

      for (var i = 0; i < this._alphas.length; i++){

        // computing position on the XY plane, following a circular trajectory
        var currX = this._radius * Math.cos(this._alphas[i]);
        var currY = this._radius * Math.sin(this._alphas[i]);
        var currZ = 0.0;
        var currW = 1.0;

        var currVector = [currX, currY, currZ, currW];

        // applying the transformations to obtain the position in the given
        // plane
        var transform = utils.MakeRotateXMatrix(this._rotVector[0]);
        transform = utils.multiplyMatrices(utils.MakeRotateYMatrix(this._rotVector[1]), transform);
        transform = utils.multiplyMatrices(utils.MakeTranslateMatrix(this._center[0], this._center[1], this._center[2]), transform);
        var nextPos = utils.multiplyMatrixVector(transform, currVector);
        positions.push(nextPos);
      }

      return positions;

  }

}
