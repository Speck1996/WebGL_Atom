class SphereModel{
	constructor(){
			var i;
			var j;
			var k;

			var x;
			var y;
			var z;

			var uv = [0.375, 0.484375];

			var lastVert;

			this._vertices = [
				0.0, 1.0, 0.0
			];

			this._vertexNormals = [
				0.0, 1.0, 0.0
			];

			this._textures = [];

			this._textures = this._textures.concat(uv);

			///// Creates vertices
			k = 3;
			for (j = 1; j < 18; j++) {
				for (i = 0; i < 36; i++) {
					this._textures = this._textures.concat(uv);


					x = Math.sin(i * 10.0 / 180.0 * Math.PI) * Math.sin(j * 10.0 / 180.0 * Math.PI);
					y = Math.cos(j * 10.0 / 180.0 * Math.PI);
					z = Math.cos(i * 10.0 / 180.0 * Math.PI) * Math.sin(j * 10.0 / 180.0 * Math.PI);
					this._vertexNormals[k] = x;
					this._vertices[k++] = x;
		      this._vertexNormals[k] = y;
		      this._vertices[k++] = y;
		      this._vertexNormals[k] = z;
		      this._vertices[k++] = z;

				}
			}

			this._textures = this._textures.concat(uv);

			lastVert = k;
			this._vertexNormals[k] = 0.0;
			this._vertices[k++] = 0.0;
		  this._vertexNormals[k] = -1.0;
		  this._vertices[k++] = -1.0;
		  this._vertexNormals[k] = 0.0;
		  this._vertices[k++] = 0.0;

			////// Creates indices
			this._indices = [];
			k = 0;
			///////// Lateral part
			for (i = 0; i < 36; i++) {
				for (j = 1; j < 17; j++) {
					this._indices[k++] = i + (j - 1) * 36 + 1;
					this._indices[k++] = i + j * 36 + 1;
					this._indices[k++] = (i + 1) % 36 + (j - 1) * 36 + 1;

					this._indices[k++] = (i + 1) % 36 + (j - 1) * 36 + 1;
					this._indices[k++] = i + j * 36 + 1;
					this._indices[k++] = (i + 1) % 36 + j * 36 + 1;
				}
			}
			//////// Upper Cap
			for (i = 0; i < 36; i++) {
				this._indices[k++] = 0;
				this._indices[k++] = i + 1;
				this._indices[k++] = (i + 1) % 36 + 1;
			}
			//////// Lower Cap
			for (i = 0; i < 36; i++) {
				this._indices[k++] = lastVert;
				this._indices[k++] = (i + 1) % 36 + 541;
				this._indices[k++] = i + 541;
			}
	}

	get vertices() {
			return this._vertices;
	}

	get vertexNormals() {
			return this._vertexNormals;
	}

	get textures() {
			return this._textures;
	}

	get indices() {
			return this._indices;
	}

}
