#version 300 es

in vec4 inCubePosition;
uniform mat4 projViewMat;
out vec4 fsPos;

void main() {
  fsPos = inCubePosition;
  gl_Position =  inCubePosition;
  gl_Position.z = 1.0;
}
