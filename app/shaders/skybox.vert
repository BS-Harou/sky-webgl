precision mediump float;

attribute vec3 pos;
attribute vec3 normal;

attribute vec2 aTexCoords;

uniform mat4 pMatrix;
uniform mat4 uTransform;


varying vec2 vTexCoords;


void main() {
	vec3 tmp = normal;
	vTexCoords = aTexCoords;
	gl_Position = pMatrix * uTransform * vec4(pos, 1);;
}