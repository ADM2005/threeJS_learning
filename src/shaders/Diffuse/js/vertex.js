export default `

vec4 p;
varying vec2 vUv;
varying vec3 vNormal;


void main (){
    p = projectionMatrix * modelViewMatrix * vec4(
        position, 1.0
    );
    gl_Position = p;
    vUv = uv;
    vNormal = normalMatrix * normal;
}
    `;