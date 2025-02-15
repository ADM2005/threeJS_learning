import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';

import { createInterpolatedPos } from '../materials/InterpolatedPos.js';
import { createWood } from '../materials/Wood.js';
export class Sphere1{
    constructor() {
        this.geometry = new THREE.BoxGeometry(2,1,1);
        this.material = createWood();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    update(delta){
        this.mesh.rotation.x += 200 * 0.011 * delta;
        this.mesh.rotation.y += 200 * 0.013 * delta;
    }
}