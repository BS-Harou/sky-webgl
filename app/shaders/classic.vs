precision mediump float;
attribute vec3 pos;
attribute vec3 normal;

uniform mat4 pMatrix;
uniform mat4 uTransform;
uniform mat4 uNormalTransform;

varying vec3 vPos;
varying float posZ;
varying vec3 vNormal;


void main() {
	vNormal = (uNormalTransform * vec4(normal, 1)).xyz;
	posZ = pos.z;
	vPos = (uTransform * vec4(pos, 1)).xyz;
	gl_Position = pMatrix * uTransform * vec4(pos, 1);;
}