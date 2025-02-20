import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';

import { createInterpolatedPos } from '../materials/InterpolatedPos.js';

export class Cuboid{
    constructor() {
        this.geometry = new THREE.BoxGeometry(2,1,1);
        this.material = createInterpolatedPos();
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.elapsed = 0
        this.theta = 0;
        this.speed = 3000;
        this.rotSpeed = 500000
        this.radius = 2;

        const radiusElement = document.getElementById('radius');

        const speedElement = document.getElementById('speed');
        const rotSpeedElement = document.getElementById('rot');


        radiusElement.addEventListener("input", () => {
            this.radius = parseFloat(radiusElement.value);
        })
        
        speedElement.addEventListener("input", () => {
            this.speed = parseFloat(speedElement.value) * 2000;
        })
        
        rotSpeedElement.addEventListener("input", () => {
            this.rotSpeed = parseFloat(rotSpeedElement.value) * 500000;
        })
    }

    update(delta){
        this.elapsed += delta * this.speed;
        this.mesh.position.x = this.radius * Math.sin(this.elapsed);
        this.mesh.position.y = this.radius * Math.cos(this.elapsed);
        this.mesh.rotation.x += 0.011 * delta * this.rotSpeed;
        this.mesh.rotation.y+= 0.013 * delta * this.rotSpeed;
    }
}