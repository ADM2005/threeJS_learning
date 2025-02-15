import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';

import { createInterpolatedPos } from '../materials/InterpolatedPos.js';
import { createWood } from '../materials/Wood.js';
export class Sphere1{
    constructor() {
        this.geometry = new THREE.SphereGeometry(1,32,32);
        this.material = createWood();
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.elapsed = 0
        this.radius = 1
        this.speed = 1000;
        this.theta = 0;
    }

    update(delta){
        this.elapsed += delta * 1000;

        this.theta += this.speed * delta;
        //this.mesh.position.x = this.radius *  2 * Math.sin(this.theta);
        //this.mesh.position.y = this.radius * Math.sin(2 * this.theta);

        this.mesh.rotation.y += this.speed * delta;
        //this.mesh.rotation.y += 200 * 0.013 * delta;
    }
}