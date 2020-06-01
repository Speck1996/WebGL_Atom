var vs = `#version 300 es

in vec3 inPosition;
in vec3 inNormal;
out vec3 fsNormal;

uniform mat4 matrix;
uniform mat4 nMatrix;     //matrix to transform normals

void main() {
  fsNormal = mat3(nMatrix) * inNormal;
  gl_Position = matrix * vec4(inPosition, 1.0);
}`;

var fs = `#version 300 es

precision mediump float;

in vec3 fsNormal;
out vec4 outColor;

uniform vec3 mDiffColor; //material diffuse color
uniform vec3 lightDirection; // directional light direction vec
uniform vec3 lightColor; //directional light color

void main() {

  vec3 nNormal = normalize(fsNormal);
  vec3 lambertColor = mDiffColor * lightColor * dot(-lightDirection,nNormal);
  outColor = vec4(clamp(lambertColor, 0.0, 1.0),1.0);
}`;

function main() {
  var sphere = buildSphere();

  var vertices = sphere[0];
  var normals = sphere[1];
  var indices = sphere[2];

  var program = null;

  var sphereNormalMatrix = new Array();
  var sphereWorldMatrix = new Array();    //One world matrix for each cube...

  //define directional light
  var dirLightAlpha = -utils.degToRad(60);
  var dirLightBeta  = -utils.degToRad(120);

  var directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
              Math.sin(dirLightAlpha),
              Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
              ];
  var directionalLightColor = [0.1, 1.0, 1.0];

  //Define material color
  var cubeMaterialColor = [0.5, 0.5, 0.5];
  var lastUpdateTime = (new Date).getTime();



  // intializing models
  var trajectories = [];

  var electrons = 11;

  var firstTraj = new Trajectory(2.0, [0,0,0], 1.0, [0,0.5,0.5], 0, 8);
  var secondTraj = new Trajectory(2.0, [0,0,0], 2.0, [0,0,1], 45, 2);
  var thirdTraj = new Trajectory(2.0, [0,0,0], 3.0, [0,1,0], 0, 1);

  trajectories.push(firstTraj);
  trajectories.push(secondTraj);
  trajectories.push(thirdTraj);


  sphereWorldMatrix[0] = utils.MakeWorld( 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
  sphereNormalMatrix[0] =  utils.invertMatrix(utils.transposeMatrix(sphereWorldMatrix[0]));



  var canvas = document.getElementById("c");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    document.write("GL context not opened");
    return;
  }
  utils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.85, 0.85, 0.85, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, vs);
  var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, fs);
  var program = utils.createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
  var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
  var matrixLocation = gl.getUniformLocation(program, "matrix");
  var materialDiffColorHandle = gl.getUniformLocation(program, 'mDiffColor');
  var lightDirectionHandle = gl.getUniformLocation(program, 'lightDirection');
  var lightColorHandle = gl.getUniformLocation(program, 'lightColor');
  var normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');

  var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width/gl.canvas.height, 0.1, 100.0);

  // TODO:  camera commands
  var viewMatrix = utils.MakeView(0.0, 0.0, 6.0, 0.0, 0.0);

  var vao = gl.createVertexArray();

  gl.bindVertexArray(vao);
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  var normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(normalAttributeLocation);
  gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  drawScene();

  function animate(){

    var currentTime = (new Date).getTime();

    if(lastUpdateTime){

      // computing next position for each sphere in each trajectory
      for(var i = 0; i < trajectories.length; i++){

         var currTraj = trajectories[i];

         var deltaAlpha = (currTraj.speed * (currentTime - lastUpdateTime)) / 1000.0;
         currTraj.updateAlphas(deltaAlpha);

      }
    }

    var k = 1;
    for ( var i = 0; i < trajectories.length; i++){

      // retrieving positions for each sphere assigned to the given trajectory
      var nextPositions = trajectories[i].gibePos();

      for(var j = 0; j < nextPositions.length; j++){

        var nextPos = nextPositions[j];
        // starting from 1 because the first sphere is the static one.
        sphereWorldMatrix[k] = utils.MakeWorld( nextPos[0], nextPos[1], nextPos[2], 0.0, 0.0, 0.0, 0.5);
        sphereNormalMatrix[k] = utils.invertMatrix(utils.transposeMatrix(sphereWorldMatrix[k]));
        k++;

      }
    }

    lastUpdateTime = currentTime;
  }

  function drawScene() {
    animate();

    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(i = 0; i < (electrons + 1); i++){
      var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, sphereWorldMatrix[i]);
      var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));

      gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(sphereNormalMatrix[i]));


      gl.uniform3fv(materialDiffColorHandle, cubeMaterialColor);
      gl.uniform3fv(lightColorHandle,  directionalLightColor);
      gl.uniform3fv(lightDirectionHandle,  directionalLight);

      gl.bindVertexArray(vao);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );
    }

    window.requestAnimationFrame(drawScene);
  }

}

main();
