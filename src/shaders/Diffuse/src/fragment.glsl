varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D albedo;

uniform struct Light {
    vec3 direction;
    vec3 color;
    float intensity;
} lights[10]; // Maximum of 10 Directional Lights

uniform int numLights;

uniform struct ambient{
    vec3 color;
    float intensity;
}


vec3 computeLighting(vec3 N, vec3 L, vec3 color, float intensity){
    // Lambertian Diffuse
    float diffuse = max(dot(N, -L), 0.0);
    return diffuse * lightColor * intensity;
}
void main(){
    //gl_FragColor = texture2D(albedo, vUv);
    vec3 normal = normalize(vNormal);
    vec3 albedo = texture2D(albedo, vUv).rgb;

    vec3 finalColor = vec3(0.0);
    for(int i = 0; i < numLights; i++){
        finalColor += computeLighting(normal, lights[i].direction, lights[i].color, lights[i].intensity);
    }
    gl_FragColor = vec4(finalColor * albedo, 1.0);
}
