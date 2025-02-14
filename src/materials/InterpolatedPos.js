import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';

import vertexShader from '../shaders/InterpolatedPos/js/vertex.js';
import fragmentShader from '../shaders/InterpolatedPos/js/fragment.js';

export function createInterpolatedPos(){
    return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
        }
    });
}

