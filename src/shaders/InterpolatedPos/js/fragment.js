export default `

varying vec3 vposInterpolated;

void main(){
    gl_FragColor = vec4(vposInterpolated, 1.0);
}

`;