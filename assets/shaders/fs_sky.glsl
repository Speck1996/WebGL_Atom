#version 300 es

precision highp float;

uniform samplerCube uSkybox;
uniform mat4 projViewMat;


in vec4 fsPos;
out vec4 color;

void main() {
  vec4 t = projViewMat * fsPos;
  color = texture(uSkybox, normalize(t.xyz/t.w));
}
