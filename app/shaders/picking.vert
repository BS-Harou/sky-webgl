precision mediump float;
attribute vec3 pos;
attribute vec3 normal;
attribute vec2 aTexCoords;

uniform mat4 pMatrix;
uniform mat4 uTransform;


void main() {
	aTexCoords;
	normal;
	gl_Position = pMatrix * uTransform * vec4(pos, 1);
}