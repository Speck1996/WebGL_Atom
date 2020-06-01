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

  var program = null;

  var sphereNormalMatrix = [];
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
  var sphereMaterialColor = [0.5, 0.5, 0.5];
  var lastUpdateTime = (new Date).getTime();

  var alpha1 = 0.0;
  var alpha2 = Math.PI*2/3;
  var alpha3 = Math.PI*4/3;
  var elec1X = 3.0 * Math.cos(alpha1);
  var elec1Y = 3.0 * Math.sin(alpha1);
  var elec1Z = 0.0;
  var elec2X = 3.0 * Math.cos(alpha2);
  var elec2Y = 3.0 * Math.sin(alpha2);
  var elec2Z = 0.0;
  var elec3X = 3.0 * Math.cos(alpha3);
  var elec3Y = 3.0 * Math.sin(alpha3);
  var elec3Z = 0.0;

  sphereWorldMatrix[0] = utils.MakeWorld( 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5);
  sphereNormalMatrix[0] = utils.invertMatrix(utils.transposeMatrix(sphereWorldMatrix[0]));

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
  
  var perspectiveMatrix = utils.MakePerspective(45, gl.canvas.width/gl.canvas.height, 0.1, 100.0);
  var viewMatrix = utils.MakeView(0.0, 0.0, 10.0, 0.0, 0.0);
    
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
        var r = 3.0;
        var w = 0.08;
      var deltaC = (30 * (currentTime - lastUpdateTime)) / 1000.0;
        alpha1 += (deltaC * w) % (2 * Math.PI)
        elec1X = r * Math.cos(alpha1);
        elec1Y = r * Math.sin(alpha1);
        
        alpha2 += (deltaC * w) % (2 * Math.PI)
        elec2X = r * Math.cos(alpha2);
        elec2Y = r * Math.sin(alpha2);
        
        alpha3 += (deltaC * w) % (2 * Math.PI)
        elec3X = r * Math.cos(alpha3);
        elec3Y = r * Math.sin(alpha3);
    }
        
    var objCoord1 = [elec1X, elec1Y, elec1Z, 1.0];
    var transform = utils.MakeRotateXMatrix(90);
    transform = utils.multiplyMatrices(utils.MakeRotateYMatrix(0), transform);
    objCoord1 = utils.multiplyMatrixVector(transform, objCoord1);
      
    var objCoord2 = [elec2X, elec2Y, elec2Z, 1.0];
    transform = utils.MakeRotateXMatrix(45);
    transform = utils.multiplyMatrices(utils.MakeRotateYMatrix(45), transform);
    objCoord2 = utils.multiplyMatrixVector(transform, objCoord2);
      
    var objCoord3 = [elec3X, elec3Y, elec3Z, 1.0];
    transform = utils.MakeRotateXMatrix(225);
    transform = utils.multiplyMatrices(utils.MakeRotateYMatrix(225), transform);
      objCoord3 = utils.multiplyMatrixVector(transform, objCoord3);
        
    sphereWorldMatrix[1] = utils.MakeWorld( objCoord1[0], objCoord1[1], objCoord1[2], 0.0, 0.0, 0.0, 0.1);
    sphereNormalMatrix[1] = utils.invertMatrix(utils.transposeMatrix(sphereWorldMatrix[1]));
    sphereWorldMatrix[2] = utils.MakeWorld( objCoord2[0], objCoord2[1], objCoord2[2], 0.0, 0.0, 0.0, 0.1);
    sphereNormalMatrix[2] = utils.invertMatrix(utils.transposeMatrix(sphereWorldMatrix[2]));
    sphereWorldMatrix[3] = utils.MakeWorld( objCoord3[0], objCoord3[1], objCoord3[2], 0.0, 0.0, 0.0, 0.1);
    sphereNormalMatrix[3] = utils.invertMatrix(utils.transposeMatrix(sphereWorldMatrix[3]));
    lastUpdateTime = currentTime;               
  }

  function drawScene() {
    animate();

    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(i = 0; i < 4; i++){
      var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, sphereWorldMatrix[i]);
      var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
      
      gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(sphereNormalMatrix[i]));

      gl.uniform3fv(materialDiffColorHandle, sphereMaterialColor);
      gl.uniform3fv(lightColorHandle,  directionalLightColor);
      gl.uniform3fv(lightDirectionHandle,  directionalLight);

      gl.bindVertexArray(vao);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );
    }
    
    window.requestAnimationFrame(drawScene);
  }

}

main();

