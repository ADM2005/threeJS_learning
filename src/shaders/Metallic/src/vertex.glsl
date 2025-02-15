vec4 p;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main (){
    p = projectionMatrix * modelViewMatrix * vec4(
        position, 1.0
    );
    gl_Position = p;
    vUv = uv;
    vNormal = normalMatrix * normal;
    vPosition = (modelMatrix * vec4(position,1)).xyz;
}