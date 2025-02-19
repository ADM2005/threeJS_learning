import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';

import { createInterpolatedPos } from '../materials/InterpolatedPos.js';

export class Cuboid{
    constructor() {
        this.geometry = new THREE.BoxGeometry(2,1,1);
        this.material = createInterpolatedPos();
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.elapsed = 0
        this.theta = 0;
        this.speed = 300000;
    }

    update(delta){
        this.elapsed += delta * 1000;
        this.mesh.rotation.x += 0.011 * delta * this.speed;
        this.mesh.rotation.y+= 0.013 * delta * this.speed;
    }
}