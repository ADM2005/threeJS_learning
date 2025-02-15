import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';

import vertexShader from '../shaders/Diffuse/js/vertex.js';
import fragmentShader from '../shaders/Diffuse/js/fragment.js';


export function createWood(){
    const texture = new THREE.TextureLoader().load("../../public/textures/uv.bmp");

    return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            albedo: {value: texture},
            lights: {value: []},
            numLights: {value: 0},
            ambient: {value: {}}
        }
    });
}

