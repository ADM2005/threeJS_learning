export default `
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
} lights[10]; // Maximum of 10 Directional Lights

uniform int numLights;

uniform struct ambient_T{
    vec3 color;
    float intensity;
} ambient;


vec3 computeDirectionalLight(vec3 N, vec3 L, vec3 color, float intensity){
    // Lambertian Diffuse
    float diffuse = max(dot(N, -L), 0.0);
    return diffuse * color * intensity;
}

vec3 computePointLight(vec3 N, vec3 pos, vec3 color, float intensity){
    vec3 lightDir = pos - vPosition;
    float distance = length(lightDir);
    lightDir = normalize(lightDir);

    float attenuation = 1.0 / (distance * distance);

    float diffuse = max(dot(N, lightDir), 0.0);
    return diffuse * color * intensity * attenuation;
}
void main(){
    //gl_FragColor = texture2D(albedo, vUv);
    vec3 normal = normalize(vNormal);
    vec3 albedo = texture2D(albedo, vUv).rgb;

    vec3 finalColor = vec3(0.0);
    for (int i = 0; i < 10; i++){
        if(i < numLights){
            if(!lights[i].isPointLight){
                finalColor += computeDirectionalLight(normal, lights[i].direction, lights[i].color, lights[i].intensity);
            }else{
                finalColor += computePointLight(normal, lights[i].position, lights[i].color, lights[i].intensity);
            }
        }
    }
    finalColor += ambient.color * ambient.intensity;
    gl_FragColor = vec4(finalColor * albedo, 1.0);
}

`;