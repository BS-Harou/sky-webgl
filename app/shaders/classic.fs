precision mediump float;
uniform vec4 uColor;

varying float posZ;
varying vec3 n;

void main() {
	if (uColor.r != 1.0) {
		gl_FragColor = vec4(uColor.r, uColor.g + posZ * 30.0, uColor.b + posZ * 30.0, 1);
	} else {
		vec3 dirVec = vec3(0.3, 0.3, 0.3);
		gl_FragColor = vec4(0.5, 0.5, 1, 1) + vec4(vec3(1, 1, 1) * max(dot(n, dirVec), 0.0), 1);
	}
}