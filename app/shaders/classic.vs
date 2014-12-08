attribute vec3 pos;
attribute vec3 normal;

uniform mat4 pMatrix;
uniform mat4 uTransform;

varying float posZ;
varying vec3 n;


void main() {
	n = normal;
	posZ = pos.z;
	gl_Position = pMatrix * uTransform * vec4(pos, 1);
}