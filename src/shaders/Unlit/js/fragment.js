export default `

varying vec2 vUv;

uniform sampler2D albedo;

void main(){
    gl_FragColor = texture2D(albedo, vUv);
}
`;