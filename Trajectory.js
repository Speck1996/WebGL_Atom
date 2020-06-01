class Trajectory {

  constructor(radius, center, speed, direction, alphaInit, numSpheres ) {
    this._radius = radius;
    this._center = center;
    this._speed = speed;
    this._direction = direction;
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

  get direction(){
    return this._direction;
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

  assignAlphas(alphaInit){
    var deltaAngle = (2 * Math.PI) / this._numSpheres;

    var alphas = [];

    for (var i = 0; i < this._numSpheres; i++){
        var alpha = alphaInit + i * deltaAngle;
        alphas.push(alpha);
    }

    this._alphas = alphas;
  }

  updateAlphas(deltaAlpha){

    for (var i = 0; i < this._alphas.length; i ++){
      this._alphas[i] += deltaAlpha;
    }

  }

  gibePos(){
      var normal = utils.normalizeVector3(this._direction);

      // STEP I: detecting one of the two axis on the plane perpendicular
      // to the given direction. For simplicity its 2 first components are set
      // to 1. This formula is based on the dot product == 0 property of two
      // perpendicular vectors

      var firstArbAxis = new Array(3);

      // this parameter is used to avoid the 0, 0, 0 vector
      var zeroMess = 0;

      // this a very simple way to generate the first vector: it takes the
      // given direction and set its own coordinates equal to 0 if the
      // direction coordinate is different from 0, or equal to 1 if the
      // given direction has a coordinate equal to 0
      for (var i = 0; i < normal.length; i++){

        if(normal[i] == 0){
          firstArbAxis[i] = 1.0;
        }else{
          firstArbAxis[i] = 0.0;
          zeroMess++;
        }
      }


      if(zeroMess != 3){
        var firstArbAxis = utils.normalizeVector3(firstArbAxis);

      // arbitrarly set two components and computes the third one, using the
      // dot product equation
      }else{

        var missingComp = - (normal[0] + normal[1])/normal[2];
        var firstArbAxis = utils.normalizeVector3([1.0, 1.0, missingComp]);
      }


      // STEP 2: the third vector can be simply computed through a cross
      // vector operation
      var secondAxis = utils.crossVector(normal, firstArbAxis);

      // STEP 3: computing next position with the given circular trajectory
      // on the computed axis, for each sphere
      var positions = [];

      for(i = 0; i < this._numSpheres; i++){
          var sphereTx = this._center[0] + this._radius * Math.cos(this._alphas[i]) * firstArbAxis[0]
                                         + this._radius * Math.sin(this._alphas[i]) * secondAxis[0];
          var sphereTy = this._center[1] + this._radius * Math.cos(this._alphas[i]) * firstArbAxis[1]
                                         + this._radius * Math.sin(this._alphas[i]) * secondAxis[1];
          var sphereTz = this._center[2] + this._radius * Math.cos(this._alphas[i]) * firstArbAxis[2]
                                         + this._radius * Math.sin(this._alphas[i]) * secondAxis[2];

          positions.push([sphereTx, sphereTy, sphereTz]);
      }

      return positions;

  }

}
