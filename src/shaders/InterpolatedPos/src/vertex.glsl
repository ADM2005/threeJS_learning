vec4 p;
varying vec3 vposInterpolated;

void main (){
    p = projectionMatrix * modelViewMatrix * vec4(
        position, 1.0
    );
    gl_Position = p;
    vposInterpolated = p.xyz;
}