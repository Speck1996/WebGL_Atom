//GLOBAL PARAMETERS
var gl = null;
var program = null;
var nucleusModel = null;
var orbitsModel = null;
var sphereModel = null;
var vaoNucleus = null;
var vaoOrbits = null;
var texture = null;
var canvas = null;
var shaderDir;
var baseDir;
var currentAtom = null;


const external_cam = {
    elevation: 0.01,
    angle: 0.01,
    roll: 0.01,
    internal_mode: false,
    rvx: 0.0,
    rvy: 0.0,
    rvz: 0.0,
    lookRadius: 15.0
}

const internal_cam = {
  elevation: 0.01,
  angle: 0.01,
  roll: 0.01,
  internal_mode: true,
  rvx: 0.0,
  rvy: 0.0,
  rvz: 0.0,
  lookRadius: 0.01
}


var keys = [];



function keyFunctionSwitchCam(e) {

  // i key pressed
    if(e.keyCode == 73){
      if(!internal_mode){
        rvx = external_cam.rvx;
        rvy = external_cam.rvy;
        rvz = external_cam.rvz;

        elevation = external_cam.elevation;
        angle = external_cam.angle;
        roll = external_cam.roll;

        lookRadius = external_cam.lookRadius;

        internal_mode = external_cam.internal_mode;
      }else{
        rvx = internal_cam.rvx;
        rvy = internal_cam.rvy;
        rvz = internal_camrvz;

        elevation = internal_cam.elevation;
        angle = internal_cam.angle;
        roll = internal_cam.roll;

        lookRadius = internal_cam.lookRadius;

        internal_mode = internal_cam.internal_mode;
    }

  }
}

var keyFunctionDown =function(e) {
  if(!keys[e.keyCode]) {
  	keys[e.keyCode] = true;
	switch(e.keyCode) {
	  case 37:
//console.log("KeyUp   - Dir LEFT");
		rvy = rvy - 1.0;
		break;
	  case 39:
//console.log("KeyUp   - Dir RIGHT");
		rvy = rvy + 1.0;
		break;
	  case 38:
//console.log("KeyUp   - Dir UP");
		rvx = rvx + 1.0;
		break;
	  case 40:
//console.log("KeyUp   - Dir DOWN");
		rvx = rvx - 1.0;
		break;
	}
  }
}

var keyFunctionUp =function(e) {
  if(keys[e.keyCode]) {
  	keys[e.keyCode] = false;
	  switch(e.keyCode) {
	     case 37:
//console.log("KeyDown  - Dir LEFT");
		      rvy = rvy + 1.0;
		      break;
	      case 39:
//console.log("KeyDown - Dir RIGHT");
		      rvy = rvy - 1.0;
		      break;
	      case 38:
//console.log("KeyDown - Dir UP");
		      rvx = rvx - 1.0;
		      break;
	      case 40:
//console.log("KeyDown - Dir DOWN");
		      rvx = rvx + 1.0;
		      break;
	      case 81:
	 }
  }
}



var mouseState = false;
var lastMouseX = -100, lastMouseY = -100;
function doMouseDown(event) {
	lastMouseX = event.pageX;
	lastMouseY = event.pageY;
	mouseState = true;
}
function doMouseUp(event) {
	lastMouseX = -100;
	lastMouseY = -100;
	mouseState = false;
}
function doMouseMove(event) {
  var canvas = document.getElementById("c");
	if(mouseState) {
	 var dx = event.pageX - lastMouseX;
	var dy = lastMouseY - event.pageY;
	 if((event.pageX <= 0.66 * canvas.clientWidth)) {
		if((dx != 0) || (dy != 0)) {
			angle += 0.5 * dx;
			elevation += 0.5 * dy;
		}
	  }

	  lastMouseX = event.pageX;
	  lastMouseY = event.pageY;
	}
}


function doMouseWheel(event) {
	var nLookRadius = lookRadius + event.wheelDelta/1000.0;
	if((nLookRadius > 2.0) && (nLookRadius < 20.0)) {
		lookRadius = nLookRadius;
	}
}


function resetShaderParams() {

	for(var name in defShaderParams) {
		value = defShaderParams[name];
		document.getElementById(name).value = value;
		if(document.getElementById(name).type == "select-one") {
			showHideUI(name, value);
		}
	}

  rvx = external_cam.rvx;
  rvy = external_cam.rvy;
  rvz = external_cam.rvz;

  elevation = external_cam.elevation;
  angle = external_cam.angle;
  roll = external_cam.roll;

  lookRadius = external_cam.lookRadius;

  internal_mode = external_cam.internal_mode;


}

function unifPar(pHTML, pGLSL, type) {
	this.pHTML = pHTML;
	this.pGLSL = pGLSL;
	this.type = type;
}

function noAutoSet(gl) {
}

function val(gl) {
	gl.uniform1f(program[this.pGLSL+"Uniform"], document.getElementById(this.pHTML).value);
}

function valD10(gl) {
	gl.uniform1f(program[this.pGLSL+"Uniform"], document.getElementById(this.pHTML).value / 10);
}

function valD100(gl) {
	gl.uniform1f(program[this.pGLSL+"Uniform"], document.getElementById(this.pHTML).value / 100);
}

function valCol(gl) {
	col = document.getElementById(this.pHTML).value.substring(1,7);
    R = parseInt(col.substring(0,2) ,16) / 255;
    G = parseInt(col.substring(2,4) ,16) / 255;
    B = parseInt(col.substring(4,6) ,16) / 255;
	gl.uniform4f(program[this.pGLSL+"Uniform"], R, G, B, 1);
}

function valVec3(gl) {
	gl.uniform3f(program[this.pGLSL+"Uniform"],
				 document.getElementById(this.pHTML+"X").value / 10,
				 document.getElementById(this.pHTML+"Y").value / 10,
				 document.getElementById(this.pHTML+"Z").value / 10);
}

function valDir(gl) {
	var t = utils.degToRad(document.getElementById(this.pHTML+"Theta").value);
	var p = utils.degToRad(document.getElementById(this.pHTML+"Phi").value);
	gl.uniform3f(program[this.pGLSL+"Uniform"],Math.sin(t)*Math.sin(p), Math.cos(t), Math.sin(t)*Math.cos(p));
}



function valType(gl) {
	var v = valTypeDecoder[this.pHTML][document.getElementById(this.pHTML).value];
	gl.uniform4f(program[this.pGLSL+"Uniform"], v[0], v[1], v[2], v[3]);
}

unifParArray =[
	new unifPar("ambientType","ambientType", valType),
	new unifPar("diffuseType","diffuseType", valType),
	new unifPar("specularType","specularType", valType),
	new unifPar("emissionType","emissionType", valType),

	new unifPar("LAlightType","LAlightType", valType),
	new unifPar("LAPos","LAPos", valVec3),
	new unifPar("LADir","LADir", valDir),
	new unifPar("LAConeOut","LAConeOut", val),
	new unifPar("LAConeIn","LAConeIn", valD100),
	new unifPar("LADecay","LADecay", val),
	new unifPar("LATarget","LATarget", valD10),
	new unifPar("LAlightColor","LAlightColor", valCol),

	new unifPar("LBlightType","LBlightType", valType),
	new unifPar("LBPos","LBPos", valVec3),
	new unifPar("LBDir","LBDir", valDir),
	new unifPar("LBConeOut","LBConeOut", val),
	new unifPar("LBConeIn","LBConeIn", valD100),
	new unifPar("LBDecay","LBDecay", val),
	new unifPar("LBTarget","LBTarget", valD10),
	new unifPar("LBlightColor","LBlightColor", valCol),

	new unifPar("LClightType","LClightType", valType),
	new unifPar("LCPos","LCPos", valVec3),
	new unifPar("LCDir","LCDir", valDir),
	new unifPar("LCConeOut","LCConeOut", val),
	new unifPar("LCConeIn","LCConeIn", valD100),
	new unifPar("LCDecay","LCDecay", val),
	new unifPar("LCTarget","LCTarget", valD10),
	new unifPar("LClightColor","LClightColor", valCol),

	new unifPar("ambientLightColor","ambientLightColor", valCol),
	new unifPar("ambientLightLowColor","ambientLightLowColor", valCol),
	new unifPar("ADir","ADir", valDir),
	new unifPar("diffuseColor","diffuseColor", valCol),
	new unifPar("DTexMix","DTexMix", valD100),
	new unifPar("specularColor","specularColor", valCol),
	new unifPar("SpecShine","SpecShine", val),
	new unifPar("DToonTh","DToonTh", valD100),
	new unifPar("SToonTh","SToonTh", valD100),
	new unifPar("ambientMatColor","ambientMatColor", valCol),
	new unifPar("emitColor","emitColor", valCol),
	new unifPar("","eyePos", noAutoSet)
];

async function setCMesh(){
  currentAtom = new Atom(6);
  var nucleusStr = await utils.get_objstr(baseDir + "Atoms/C/nucleusC.obj");
  nucleusModel = new OBJ.Mesh(nucleusStr);
  reloadBuffer(vaoNucleus, nucleusModel);

  var orbitsStr = await utils.get_objstr(baseDir + "Atoms/C/orbitC.obj");
  orbitsModel = new OBJ.Mesh(orbitsStr);
  reloadBuffer(vaoOrbits, orbitsModel);
}

async function setHMesh(){
  currentAtom = new Atom(1);
  var nucleusStr = await utils.get_objstr(baseDir + "Atoms/H/nucleusH.obj");
  nucleusModel = new OBJ.Mesh(nucleusStr);
  reloadBuffer(vaoNucleus, nucleusModel);

  var orbitsStr = await utils.get_objstr(baseDir + "Atoms/H/orbitH.obj");
  orbitsModel = new OBJ.Mesh(orbitsStr);
  reloadBuffer(vaoOrbits, orbitsModel);
}

async function setHeMesh(){
  currentAtom = new Atom(2);
  var nucleusStr = await utils.get_objstr(baseDir + "Atoms/He/nucleusHe.obj");
  nucleusModel = new OBJ.Mesh(nucleusStr);
  reloadBuffer(vaoNucleus, nucleusModel);

  var orbitsStr = await utils.get_objstr(baseDir + "Atoms/He/orbitHe.obj");
  orbitsModel = new OBJ.Mesh(orbitsStr);
  reloadBuffer(vaoOrbits, orbitsModel);
}

async function setOMesh(){
  currentAtom = new Atom(8);
  var nucleusStr = await utils.get_objstr(baseDir + "Atoms/O/nucleusO.obj");
  nucleusModel = new OBJ.Mesh(nucleusStr);
  reloadBuffer(vaoNucleus, nucleusModel);

  var orbitsStr = await utils.get_objstr(baseDir + "Atoms/O/orbitO.obj");
  orbitsModel = new OBJ.Mesh(orbitsStr);
  reloadBuffer(vaoOrbits, orbitsModel);

}

function reloadBuffer(vao, model){
    gl.bindVertexArray(vao);

    var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
    var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
    var uvAttributeLocation = gl.getAttribLocation(program, "inUv");


    var positionBufferNuc = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferNuc);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var normalBufferNuc = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferNuc);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertexNormals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var indexBufferNuc = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferNuc);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);

    var uvBufferNuc = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBufferNuc);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.textures), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(uvAttributeLocation);
    gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);

}

function loadText(){

  // Create a texture.
  texture = gl.createTexture();
  // use texture unit 0
  gl.activeTexture(gl.TEXTURE0);
  // bind to the TEXTURE_2D bind point of texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Asynchronously load an image
  var image = new Image();
  image.src = baseDir + "texture.png";
  image.txNum = 0;
  image.onload = function() {
      gl.activeTexture(gl.TEXTURE0);

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      gl.generateMipmap(gl.TEXTURE_2D);
    };

}

function main() {


  function getUniLoc(){
    var normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');
    var textLocation = gl.getUniformLocation(program, "uTexture");

    for(var i = 0; i < unifParArray.length; i++) {
      program[unifParArray[i].pGLSL+"Uniform"] = gl.getUniformLocation(program, unifParArray[i].pGLSL);
    }

  }



  resetShaderParams();


  var lastUpdateTime = (new Date).getTime();

  var sphereWorldMatrices = [];
  var sphereNormalMatrices = [];

  utils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.85, 0.85, 0.85, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);


  var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width/gl.canvas.height, 0.1, 100.0);

  var vaoSphere = gl.createVertexArray();


  // nucleus model buffers
  reloadBuffer(vaoNucleus, nucleusModel);
  // orbits model buffers
  reloadBuffer(vaoOrbits, orbitsModel);

  // electron model buffers
  reloadBuffer(vaoSphere, sphereModel);

  getUniLoc();

  loadText();

  drawScene();

  // compute new electron positions
  function animate(){

    var currentTime = (new Date).getTime();

    if(lastUpdateTime){

      // computing next position for each sphere in each trajectory
      for(var i = 0; i < currentAtom.trajectories.length; i++){
         var currTraj = currentAtom.trajectories[i];

         // updating the current positions of the spheres in the given
         // trajectory
         currTraj.updateAlpha(currentTime - lastUpdateTime);

      }
    }

    for ( var i = 0; i < currentAtom.trajectories.length; i++){

      // retrieving positions for the sphere assigned to the given trajectory
      var nextPos = currentAtom.trajectories[i].gibePos();


      sphereWorldMatrices[i] = utils.MakeWorld( nextPos[0], nextPos[1], nextPos[2], 0.0, 0.0, 0.0, 0.2);
      sphereNormalMatrices[i] = utils.invertMatrix(utils.transposeMatrix(sphereWorldMatrices[i]));
    }

    lastUpdateTime = currentTime;
  }

  // camera can be adjusted dynamically with the mouse
  function updateCamera(){
    angle = angle + rvy;
    elevation = elevation + rvx;

    cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
    cx = lookRadius * Math.sin(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
    cy = lookRadius * Math.sin(utils.degToRad(-elevation));

  }

  function drawModel(vao, worldMatrix, normalMatrix , viewMatrix , indices){

    var textLocation = gl.getUniformLocation(program, "uTexture");
    var matrixLocation = gl.getUniformLocation(program, "matrix");
    var normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');



    var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
    var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
    gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
    gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalMatrix));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(textLocation, 0);
    gl.uniform3f(program.eyePosUniform, cx, cy, cz);

    for(var j = 0; j < unifParArray.length; j++) {
      unifParArray[j].type(gl);
    }

    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );

  }



  function drawScene() {

    updateCamera();

    var viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);

    //updating electron position (world matrixm normal matrix)
    animate();

    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var nucWorldMatrix = utils.MakeWorld( 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5);
    var nucNormalMatrix = utils.invertMatrix(utils.transposeMatrix(nucWorldMatrix));

    var orbitsWorldMatrix = utils.MakeWorld(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5);
    var orbitsNormalMatrix = utils.invertMatrix(utils.transposeMatrix(orbitsWorldMatrix));

    if(!internal_mode){
      drawModel(vaoNucleus, nucWorldMatrix, nucNormalMatrix, viewMatrix, nucleusModel.indices);
    }
    drawModel(vaoOrbits, orbitsWorldMatrix, orbitsNormalMatrix, viewMatrix, orbitsModel.indices);

    for(var i = 0; i < currentAtom.trajectories.length; i++){

      drawModel(vaoSphere, sphereWorldMatrices[i], sphereNormalMatrices[i], viewMatrix, sphereModel.indices);
    }

    window.requestAnimationFrame(drawScene);
  }

}

// gets the canvas element and adds ui listener to it
function setUpCanvas(){

      canvas = document.getElementById("c");

      canvas.addEventListener("mousedown", doMouseDown, false);
      canvas.addEventListener("mouseup", doMouseUp, false);
      canvas.addEventListener("mousemove", doMouseMove, false);
      canvas.addEventListener("mousewheel", doMouseWheel, false);
      window.addEventListener("keyup", keyFunctionUp, false);
      window.addEventListener("keydown", keyFunctionDown, false);
      window.addEventListener("keyup", keyFunctionSwitchCam , false);

}

async function init(){

    var path = window.location.pathname;
    var page = path.split("/").pop();
    baseDir = window.location.href.replace(page, '') + 'assets/';
    shaderDir = baseDir+"shaders/";

    // adding listener to the canvas
    setUpCanvas();

    gl = canvas.getContext("webgl2");

    if (!gl) {
        document.write("GL context not opened");
        return;
    }

    // loading shaders
    await utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs.glsl'], function (shaderText) {
      var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
      var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
      program = utils.createProgram(gl, vertexShader, fragmentShader);
    });

    gl.linkProgram(program);
    gl.useProgram(program);

    // loading sphere model
    sphereModel = new SphereModel();

    // initializing vertex arrays
    vaoSphere = gl.createVertexArray();
    vaoNucleus = gl.createVertexArray();
    vaoOrbits = gl.createVertexArray();

    await setCMesh();

    main();
}


window.onload = init;
