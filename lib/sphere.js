// Draws a Sphere --- Already done, just for inspiration

function buildSphere(){

	var vertices = [
		0.0, 1.0, 0.0
	];

	var normals = [
		0.0, 1.0, 0.0
	];

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

		}
	}

	lastVert = k;
	normals[k] = 0.0;
	vertices[k++] = 0.0;
  normals[k] = -1.0;
  vertices[k++] = -1.0;
  normals[k] = 0.0;
  vertices[k++] = 0.0;


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

	return [vertices, normals, indices];
}
