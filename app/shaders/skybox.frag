precision mediump float;

uniform sampler2D uTexture;
uniform int uUseMist;

varying vec2 vTexCoords;

void main() {

	if (uUseMist == 1) {
		gl_FragColor = vec4(0.5, 0.5, 0.5, 1);
		return;
	}

	gl_FragColor = vec4(texture2D(uTexture, vTexCoords).xyz, 1);
}