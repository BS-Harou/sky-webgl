precision mediump float;
uniform vec4 uColor; // only for testing
uniform vec4 uGlobalAmbient;

uniform sampler2D uTexture;
varying vec2 vTexCoords;
uniform int uUseTextures;
uniform mat4 uTextureTransform;

uniform sampler2D uMapTexture;
uniform int uUseSpecMap;


uniform sampler2D uLights;
uniform int uNumberOfLights;
const int LINES_PER_LIGHT = 5;
const int MAX_LIGHTS = 64;
const float E = 2.718281828459045;

uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;
uniform vec4 uMaterialEmission;
uniform float uMaterialShininess;

uniform vec3 uCameraPosition; // TODO
uniform mat4 pMatrix;

varying float posZ;
varying vec3 vPos;
varying vec3 vNormal;

void main() {
	vec4 finalColor = uMaterialEmission + uGlobalAmbient;

	/* TODO uNumberOfLights*/
	for (int i=0; i < MAX_LIGHTS; i++) {
		if (i >= uNumberOfLights) break;

		// TODO, change 5.0 to LINES_PER_LIGHT and solve the onversion issue
		float p = 5.0 * float(uNumberOfLights);

		/**
		 * Phong light model
		 * We use float-texture to pass arbitrary amount of lights to shaders
		 * Each light has 5 texels
		 * The 'blue' float of last texel detemines whether it is directional or point light
		 */
		vec3 lightPosition = texture2D(uLights, vec2((float(i * LINES_PER_LIGHT) + 0.5) / p, 0.5)).xyz;
		vec4 lightAmbient = texture2D(uLights,  vec2((float(i * LINES_PER_LIGHT) + 1.5) / p, 0.5));
		vec4 lightDiffuse = texture2D(uLights,  vec2((float(i * LINES_PER_LIGHT) + 2.5) / p, 0.5));
		vec4 lightSpecular = texture2D(uLights, vec2((float(i * LINES_PER_LIGHT) + 3.5) / p, 0.5));
		vec3 attenuation = texture2D(uLights,   vec2((float(i * LINES_PER_LIGHT) + 4.5) / p, 0.5)).xyz;
		float type = texture2D(uLights,   vec2((float(i * LINES_PER_LIGHT) + 4.5) / p, 0.5)).w;

		vec3 L;
		if (type < 0.5) { // directional
			L = normalize(lightPosition);
		} else { // point
			L = normalize(lightPosition - vPos);
		}

		vec3 C = normalize(uCameraPosition - vPos);
		vec3 N = normalize(vNormal);
		float d = distance(lightPosition, vPos);

		vec4 ambientReflected = lightAmbient * uMaterialAmbient;

		vec4 diffuseReflected = max(dot(L, N), 0.0) * lightDiffuse * uMaterialDiffuse;

		if (uUseTextures == 1) {
			diffuseReflected = diffuseReflected * texture2D(uTexture, (uTextureTransform * vec4(vTexCoords, 0, 1)).st);
		}

		vec4 specularReflected = vec4(0.0, 0.0, 0.0, 1.0);
		if (dot(N, L) >= 0.0) {
    		specularReflected = pow(max(dot(reflect(-L, N), C) , 0.0), uMaterialShininess) * lightSpecular * uMaterialSpecular;
    	}

    	if (uUseSpecMap == 1) {
			specularReflected = specularReflected * texture2D(uMapTexture, (uTextureTransform * vec4(vTexCoords, 0, 1)).st);
		}

		float attenuationFactor;
		if (type < 0.5) { // directional
			attenuationFactor = 1.0;
		} else { // point
			attenuationFactor = 1.0 / (attenuation.x + attenuation.y * d + attenuation.z * pow(d, 2.0));
		}

		finalColor += attenuationFactor * (ambientReflected + diffuseReflected + specularReflected);

	}

	// FOG
	float dist = distance(uCameraPosition, vPos);
	float density = 0.05;
	float f =  pow(E, -(density * dist));
	vec4 fogColor = vec4(0, 0, 0, 1);

	gl_FragColor = f * finalColor + (1.0 -f ) * fogColor;

}