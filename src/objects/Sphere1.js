import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';
import { createUVMap } from '../materials/uvMap.js';
import { createDiffuseTest } from '../materials/diffuseTest.js';

// Import OBJLoader from Three.js examples directory
export class Sphere1{
    constructor() {
        this.geometry = new THREE.SphereGeometry(1,32,32);
        this.material = createUVMap();
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