#version 300 es

in vec3 inPosition;
in vec3 inNormal;
//in vec2 inUv;
out vec3 fsNormal;
out vec3 fsPos;
// TODO texture
//out vec2 fsUv;

uniform mat4 matrix;
uniform mat4 nMatrix;     //matrix to transform normals

void main() {
  fsPos = mat3(nMatrix) * inPosition;
  fsNormal = mat3(nMatrix) * inNormal;
// TODO texture
//  fsUv = vec2(inUv.x, 1.0-inUv.y);

  gl_Position = matrix * vec4(inPosition, 1.0);
}
