precision mediump float;

uniform sampler2D uTexture;

varying vec2 vTexCoords;

void main() {
	/*if ((vTexCoords.x < 0.1 || vTexCoords.x > 0.9) || (vTexCoords.y < 0.1 || vTexCoords.y > 0.9)) {
		gl_FragColor = vec4(1, 0, 0, 1);
	} else {
		gl_FragColor = vec4(texture2D(uTexture, vTexCoords).xyz, 1) * 3.0;
	}*/

	gl_FragColor = vec4(texture2D(uTexture, vTexCoords).xyz, 1);
}