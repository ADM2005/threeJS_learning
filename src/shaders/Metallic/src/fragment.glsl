varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D albedo;

uniform struct Light {
    vec3 direction;
    vec3 color;
    float intensity;
    vec3 position;
    bool isPointLight;
} lights[100]; // Maximum of 10 Directional Lights

uniform int numLights;

uniform struct ambient_T{
    vec3 color;
    float intensity;
} ambient;

uniform struct emitted_T {
    vec3 color;
    float intensity;
} emittedLight;

uniform float metallic;
uniform float smoothness;

uniform vec3 worldSpaceCameraPosition;

vec3 viewDir;
float oneMinusReflectivity;
vec3 specularTint;
vec3 albedoCol;
vec3 computeDirectionalLight(vec3 N, vec3 L, vec3 color, float intensity, out vec3 specular){
    // Lambertian Diffuse
    vec3 diffuse =  albedoCol * max(dot(N, -L), 0.0) * color * intensity;

    vec3 halfVector = normalize(-L + viewDir);
    float specularIntensity = smoothness;
    specular = specularIntensity * specularTint * intensity * color * pow(
        max(dot(halfVector, N),0.0),
        smoothness * 300.
    );

    return diffuse;
}

vec3 computePointLight(vec3 N, vec3 pos, vec3 color, float intensity, out vec3 specular){
    vec3 lightDir = pos - vPosition;
    float distance = length(lightDir);
    lightDir = normalize(lightDir);

    float attenuation = 1.0 / (1.0 + 0.1 * distance + 0.01 * distance * distance);

    vec3 diffuse =  albedoCol * max(dot(N, lightDir), 0.0) * color * intensity * attenuation;
    vec3 halfVector = normalize(lightDir + viewDir);

    float specularIntensity = smoothness;
    specular = specularIntensity * specularTint * color * intensity * attenuation * pow(
        max(dot(halfVector, N), 0.0),
        max(smoothness * 300., 1.)
    );
    return diffuse;
}
void main(){
    //gl_FragColor = texture2D(albedo, vUv);
    vec3 normal = normalize(vNormal);
    albedoCol = texture2D(albedo, vUv).rgb;

    viewDir = normalize(worldSpaceCameraPosition - vPosition);
    specularTint = mix(vec3(0.2),albedoCol, metallic);

    oneMinusReflectivity = 1.0 - metallic;
    albedoCol *= oneMinusReflectivity;

    vec3 finalColor = vec3(0.0);
    for (int i = 0; i < 100; i++){
        if(i < numLights){
            vec3 sourceDiffuse;
            vec3 sourceSpecular;

            if(!lights[i].isPointLight){
                sourceDiffuse = computeDirectionalLight(normal, lights[i].direction, lights[i].color, lights[i].intensity, sourceSpecular);
            }else{
                sourceDiffuse = computePointLight(normal, lights[i].position, lights[i].color, lights[i].intensity, sourceSpecular);
            }
            finalColor += sourceDiffuse + sourceSpecular;
        }
    }
    finalColor += ambient.color * ambient.intensity * texture2D(albedo, vUv).rgb;
    finalColor += emittedLight.color;
    gl_FragColor = vec4(finalColor, 1.0);
