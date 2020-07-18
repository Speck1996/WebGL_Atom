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

// camera parameters

function setDefaultCam(){
  rvx = external_cam.rvx;
  rvy = external_cam.rvy;
  rvz = external_cam.rvz;

  elevation = external_cam.elevation;
  angle = external_cam.angle;
  roll = external_cam.roll;

  lookRadius = external_cam.lookRadius;
  internal_mode = external_cam.internal_mode;
}

function setInternalCam(){
  rvx = internal_cam.rvx;
  rvy = internal_cam.rvy;
  rvz = internal_cam.rvz;

  elevation = internal_cam.elevation;
  angle = internal_cam.angle;
  roll = internal_cam.roll;

  lookRadius = internal_cam.lookRadius;
  internal_mode = internal_cam.internal_mode;
}


// Functions for mouse-camera interactions.
var keys = [];


function keyFunctionSwitchCam(e) {

  // i key pressed
    if(e.keyCode == 73){
      if(!internal_mode){
        setInternalCam();

      }else{
        setDefaultCam();

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

var keyFunctionUp = function(e) {
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

// camera can be adjusted dynamically with the mouse
function updateCamera(){
  angle = angle + rvy;
  elevation = elevation + rvx;

  cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
  cx = lookRadius * Math.sin(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
  cy = lookRadius * Math.sin(utils.degToRad(-elevation));
}
