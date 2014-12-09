precision mediump float;
uniform vec4 uColor; // = global_ambient TODO!!

uniform sampler2D uLights;
uniform int uNumberOfLights;
int LINES_PER_LIGHT = 5;

uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;
uniform vec4 uMaterialEmission;
uniform float uMaterialShininess;

uniform vec3 uCameraPosition; // TODO
uniform mat4 pMatrix;

varying float posZ;
varying vec3 vPos;
varying vec3 n;

void main() {
	vec4 finalColor = uMaterialEmission + vec4(0.1, 0.1, 0.1, 0.1) /* + uColor*/;

	for (int i=0; i < 1 /* TODO uNumberOfLights*/; i++) {
		//vec3 lightPosition = texture2D(uLights, vec2(i * LINES_PER_LIGHT, 0)).xyz;
		vec3 lightPosition = vec3(0.4, 0.8, 0.2);
		vec4 lightAmbient = texture2D(uLights, vec2(i * LINES_PER_LIGHT + 1, 0));
		//vec4 lightDiffuse = texture2D(uLights, vec2(i * LINES_PER_LIGHT + 2, 0));
		vec4 lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
		vec4 lightSpecular = texture2D(uLights, vec2(i * LINES_PER_LIGHT + 3, 0));
		vec3 attenuation = texture2D(uLights, vec2(i * LINES_PER_LIGHT + 4, 0)).xyz;

		vec3 L = normalize(lightPosition - vPos);
		vec3 C = normalize(uCameraPosition - vPos);
		vec3 N = normalize(n);
		float d = distance(lightPosition, vPos);

		vec4 ambientReflected = lightAmbient * uMaterialAmbient;
		vec4 diffuseReflected = max(dot(L, N), 0.0) * lightDiffuse * uMaterialDiffuse;

		vec4 specularReflected = vec4(0.0, 0.0, 0.0, 1.0);
		if (dot(N, L) >= 0.0) {
    		specularReflected = pow(max(dot(reflect(-L, N), C) , 0.0), uMaterialShininess) * lightSpecular * uMaterialSpecular;
    	}

		float attenuationFactor = 1.0 / (attenuation.x + attenuation.y * d + attenuation.z * pow(d, 2.0));

		//finalColor += attenuationFactor * (ambientReflected + diffuseReflected + specularReflected);
		finalColor += diffuseReflected;
	}

	gl_FragColor = finalColor;
	/*if (uColor.r != 1.0) {
		gl_FragColor = vec4(uColor.r, uColor.g + posZ * 30.0, uColor.b + posZ * 30.0, 1);
	} else {
		vec3 dirVec = vec3(0.3, 0.3, 0.3);
		gl_FragColor = vec4(0.5, 0.5, 1, 1) + vec4(vec3(1, 1, 1) * max(dot(n, dirVec), 0.0), 1);
	}*/
}