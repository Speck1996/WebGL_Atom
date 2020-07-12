function normalize(x, y, z){

	var length = Math.sqrt( x^2 + y^2 + z^2);

	var d = [];

	d[0] = x/length;
	d[1] = y/length;
	d[2] = z/length;

	return d;
}


// Draws a Sphere --- Already done, just for inspiration
function computeUv(x, y, z){
	// unit vector representing distance from vertex to center. The
	// center is assumed to be in 0,0,0
   var d = normalize(x,y,z);

	 var u = 0.5 + Math.atan2(d[0], d[2]);

	 var v = 0.5 - Math.asin(d[1])/Math.PI;

	 return [u,v];

}



function buildSphere(){

	var vertices = [
		0.0, 1.0, 0.0
	];

	var normals = [
		0.0, 1.0, 0.0
	];

	var uv = [ ];

	uv.concat(computeUv(vertices[0]));
	///// Creates vertices
	k = 3;
	for (j = 1; j < 18; j++) {
		for (i = 0; i < 36; i++) {
			x = Math.sin(i * 10.0 / 180.0 * Math.PI) * Math.sin(j * 10.0 / 180.0 * Math.PI);
			y = Math.cos(j * 10.0 / 180.0 * Math.PI);
			z = Math.cos(i * 10.0 / 180.0 * Math.PI) * Math.sin(j * 10.0 / 180.0 * Math.PI);
			normals[k] = x;
			vertices[k++] = x;
      normals[k] = y;
      vertices[k++] = y;
      normals[k] = z;
      vertices[k++] = z;

			uv.concat(computeUv(x, y, z));
		}
	}

	lastVert = k;
	normals[k] = 0.0;
	vertices[k++] = 0.0;
  normals[k] = -1.0;
  vertices[k++] = -1.0;
  normals[k] = 0.0;
  vertices[k++] = 0.0;

	uv.concat(computeUv(0.0, -1.0, 0.0));


	////// Creates indices
	var indices = [];
	k = 0;
	///////// Lateral part
	for (i = 0; i < 36; i++) {
		for (j = 1; j < 17; j++) {
			indices[k++] = i + (j - 1) * 36 + 1;
			indices[k++] = i + j * 36 + 1;
			indices[k++] = (i + 1) % 36 + (j - 1) * 36 + 1;

			indices[k++] = (i + 1) % 36 + (j - 1) * 36 + 1;
			indices[k++] = i + j * 36 + 1;
			indices[k++] = (i + 1) % 36 + j * 36 + 1;
		}
	}
	//////// Upper Cap
	for (i = 0; i < 36; i++) {
		indices[k++] = 0;
		indices[k++] = i + 1;
		indices[k++] = (i + 1) % 36 + 1;
	}
	//////// Lower Cap
	for (i = 0; i < 36; i++) {
		indices[k++] = lastVert;
		indices[k++] = (i + 1) % 36 + 541;
		indices[k++] = i + 541;
	}

	return [vertices, normals, indices, uv];
}
