//GLOBAL PARAMETERS
var gl = null;
var program = null;
var program_sky = null;
var nucleusModel = null;
var orbitsModel = null;
var sphereModel = null;
var cubeModel = null;
var vaoNucleus = null;
var vaoOrbits = null;
var vaoCube = null;
var texture = null;
var skyText = null;
var canvas = null;
var shaderDir;
var baseDir;
var currentAtom = null;

// Ui uniforms
function unifPar(pHTML, pGLSL, type) {
  this.pHTML = pHTML;
  this.pGLSL = pGLSL;
  this.type = type;
}

unifParArray =[
	new unifPar("ambientType","ambientType", uiTools.valType),
	new unifPar("diffuseType","diffuseType", uiTools.valType),
	new unifPar("specularType","specularType", uiTools.valType),
	new unifPar("emissionType","emissionType", uiTools.valType),

	new unifPar("LAlightType","LAlightType", uiTools.valType),
	new unifPar("LAPos","LAPos", uiTools.valVec3),
	new unifPar("LADir","LADir", uiTools.valDir),
	new unifPar("LAConeOut","LAConeOut", uiTools.val),
	new unifPar("LAConeIn","LAConeIn", uiTools.valD100),
	new unifPar("LADecay","LADecay", uiTools.val),
	new unifPar("LATarget","LATarget", uiTools.valD10),
	new unifPar("LAlightColor","LAlightColor", uiTools.valCol),

	new unifPar("LBlightType","LBlightType", uiTools.valType),
	new unifPar("LBPos","LBPos", uiTools.valVec3),
	new unifPar("LBDir","LBDir", uiTools.valDir),
	new unifPar("LBConeOut","LBConeOut", uiTools.val),
	new unifPar("LBConeIn","LBConeIn", uiTools.valD100),
	new unifPar("LBDecay","LBDecay", uiTools.val),
	new unifPar("LBTarget","LBTarget", uiTools.valD10),
	new unifPar("LBlightColor","LBlightColor", uiTools.valCol),

	new unifPar("LClightType","LClightType", uiTools.valType),
	new unifPar("LCPos","LCPos", uiTools.valVec3),
	new unifPar("LCDir","LCDir", uiTools.valDir),
	new unifPar("LCConeOut","LCConeOut", uiTools.val),
	new unifPar("LCConeIn","LCConeIn", uiTools.valD100),
	new unifPar("LCDecay","LCDecay", uiTools.val),
	new unifPar("LCTarget","LCTarget", uiTools.valD10),
	new unifPar("LClightColor","LClightColor", uiTools.valCol),

	new unifPar("ambientLightColor","ambientLightColor", uiTools.valCol),
	new unifPar("ambientLightLowColor","ambientLightLowColor", uiTools.valCol),
	new unifPar("ADir","ADir", uiTools.valDir),
	new unifPar("diffuseColor","diffuseColor", uiTools.valCol),
	new unifPar("DTexMix","DTexMix", uiTools.valD100),
	new unifPar("specularColor","specularColor", uiTools.valCol),
	new unifPar("SpecShine","SpecShine", uiTools.val),
	new unifPar("DToonTh","DToonTh", uiTools.valD100),
	new unifPar("SToonTh","SToonTh", uiTools.valD100),
	new unifPar("ambientMatColor","ambientMatColor", uiTools.valCol),
	new unifPar("emitColor","emitColor", uiTools.valCol),
	new unifPar("","eyePos", uiTools.noAutoSet)
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

// To draw the sky is sufficient to have a quad on the background
// and properly adjust the texture on it, through cubemap mapping
function setGeometry(gl) {
  var positions = new Float32Array(
    [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
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
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);
    };
}

// load the environment map
function loadSkyText() {
	// Create a texture.
	skyText = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyText);

  var skyDir = baseDir + 'skybox/'

	const faceInfos = [
	  {
	    target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
	    url: skyDir +'right.png',
	  },
	  {
	    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
	    url: skyDir + 'left.png',
	  },
	  {
	    target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
	    url: skyDir + 'top.png',
	  },
	  {
	    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
	    url: skyDir + 'bot.png',
	  },
	  {
	    target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
	    url: skyDir +'front.png',
	  },
	  {
	    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
	    url: skyDir + 'back.png',
	  },
	];
	faceInfos.forEach((faceInfo) => {
	  const {target, url} = faceInfo;

	  // Upload the canvas to the cubemap face.
	  const level = 0;
	  const internalFormat = gl.RGBA;
	  const width = 1024;
	  const height = 1024;
	  const format = gl.RGBA;
	  const type = gl.UNSIGNED_BYTE;

	  // setup each face so it's immediately renderable
	  gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

	  // Asynchronously load an image
	  const image = new Image();
	  image.src = url;
	  image.addEventListener('load', function() {

	    // Now that the image has loaded upload it to the texture.
	    gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyText);
      gl.texImage2D(target, level, internalFormat, format, type, image);
	    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
	  });
	});
	gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
}


function main() {
  uiTools.resetShaderParams();

  var lastUpdateTime = (new Date).getTime();

  var sphereWorldMatrices = [];
  var sphereNormalMatrices = [];

  utils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.85, 0.85, 0.85, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program_sky);
  setSkyModel();

  gl.useProgram(program);

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

  function setSkyModel(){
    var positionLocation = gl.getAttribLocation(program_sky, "inCubePosition");
    var skyLoc = gl.getUniformLocation(program_sky, "uSkybox");
    var projMatLoc = gl.getUniformLocation(program_sky, "projViewMat");

    // and make it the one we're currently working with
    gl.bindVertexArray(vaoCube);

    // Create a buffer for positions
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put the positions in the buffer
    setGeometry(gl);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration (in this case the vertices is already in clip space)
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    loadSkyText();
  }

  function drawSky(projectionMatrix){

    gl.bindVertexArray(vaoCube);
    var positionLocation = gl.getAttribLocation(program_sky, "inCubePosition");
    var skyLoc = gl.getUniformLocation(program_sky, "uSkybox");
    var projMatLoc = gl.getUniformLocation(program_sky, "projViewMat");

    // instead of getting the clip space coordinate from the cube, here the normal space coordinate
    // of the cube is obtained from the clip space coordinates by inverting the projection matrix.
    // the transpose operations is required to be compliant with gsls matrix convention
    gl.uniformMatrix4fv(projMatLoc, gl.FALSE, utils.transposeMatrix(utils.invertMatrix(projectionMatrix)));

    // Tell the shader to use texture unit 0 for u_skybox
    gl.uniform1i(skyLoc, 0);

    // let our quad pass the depth test at 1.0
    gl.depthFunc(gl.LEQUAL);

    gl.bindVertexArray(vaoCube);
    gl.drawArrays(gl.TRIANGLES, 0, 1*6);
  }

  function getUniLoc(){

    // models uniforms
    var normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');
    var textLocation = gl.getUniformLocation(program, "uTexture");

    for(var i = 0; i < unifParArray.length; i++) {
      program[unifParArray[i].pGLSL+"Uniform"] = gl.getUniformLocation(program, unifParArray[i].pGLSL);
    }
  }

  function drawModel(vao, worldMatrix, normalMatrix , projectionMatrix, indices){

    var textLocation = gl.getUniformLocation(program, "uTexture");
    var matrixLocation = gl.getUniformLocation(program, "matrix");
    var normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');

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

    utils.resizeCanvasToDisplaySize(gl.canvas);
    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.depthFunc(gl.LESS);  // use the default depth test, this will be changed
                            // by the following drawSky call

    //  Updating camera parameters
    updateCamera();


    var viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);
    var skyViewMatrix = utils.MakeView(0.0,0.0,0.0, elevation, angle);
    var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width/gl.canvas.height, 0.1, 100.0);

    // following calls will handle the atom related models
    gl.useProgram(program);


    //updating electron position (world matrixm normal matrix)
    animate();

    var nucWorldMatrix = utils.MakeWorld( 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5);
    var nucNormalMatrix = utils.invertMatrix(utils.transposeMatrix(nucWorldMatrix));

    var orbitsWorldMatrix = utils.MakeWorld(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5);
    var orbitsNormalMatrix = utils.invertMatrix(utils.transposeMatrix(orbitsWorldMatrix));

    if(!internal_mode){
      var nucProjMat = utils.MakeProjection(viewMatrix, nucWorldMatrix, perspectiveMatrix);
      drawModel(vaoNucleus, nucWorldMatrix, nucNormalMatrix, nucProjMat, nucleusModel.indices);
    }
    var orbProjMat = utils.MakeProjection(viewMatrix, orbitsWorldMatrix, perspectiveMatrix);
    drawModel(vaoOrbits, orbitsWorldMatrix, orbitsNormalMatrix, orbProjMat, orbitsModel.indices);

    for(var i = 0; i < currentAtom.trajectories.length; i++){
      var sphereProjMat = utils.MakeProjection(viewMatrix, sphereWorldMatrices[i], perspectiveMatrix);
      drawModel(vaoSphere, sphereWorldMatrices[i], sphereNormalMatrices[i], sphereProjMat, sphereModel.indices);
    }

    // now is time to draw the sky
    gl.useProgram(program_sky);
    var skyProjMat = utils.MakeProjection(skyViewMatrix, null, perspectiveMatrix);
    drawSky(skyProjMat);

    window.requestAnimationFrame(drawScene);
  }

}


async function init(){

    var path = window.location.pathname;
    var page = path.split("/").pop();
    baseDir = window.location.href.replace(page, '') + 'assets/';
    shaderDir = baseDir+"shaders/";

    // adding listener to the canvas
    uiTools.setUpListeners();

    gl = canvas.getContext("webgl2");



    if (!gl) {
        document.write("GL context not opened");
        return;
    }

    //setting up skybox environment

    // loading skybox shaders
    await utils.loadFiles([shaderDir + 'vs_sky.glsl', shaderDir + 'fs_sky.glsl'], function (shaderText) {
      var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
      var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
      program_sky = utils.createProgram(gl, vertexShader, fragmentShader);
    });


    // loading atom models shaders
    await utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs.glsl'], function (shaderText) {
      var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
      var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
      program = utils.createProgram(gl, vertexShader, fragmentShader);
    });

    // setting the gl and program reference for the Ui functions
    uiTools.setGl(gl, program);

    gl.linkProgram(program);
    gl.useProgram(program);

    // loading sphere model
    sphereModel = new SphereModel();

    // initializing vertex arrays
    vaoSphere = gl.createVertexArray();
    vaoNucleus = gl.createVertexArray();
    vaoOrbits = gl.createVertexArray();
    vaoCube = gl.createVertexArray();

    await setCMesh();

    main();
}


window.onload = init;
