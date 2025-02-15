export default `

vec4 p;
varying vec2 vUv;


void main (){
    p = projectionMatrix * modelViewMatrix * vec4(
        position, 1.0
    );
    gl_Position = p;
    vUv = uv;
}
    `;