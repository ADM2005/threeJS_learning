export default `

varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D albedo;

vec3 normal;

void main(){
    //gl_FragColor = texture2D(albedo, vUv);
    normal = normalize(vNormal);
    gl_FragColor = vec4(normal, 1.0);
}
`;