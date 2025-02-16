import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';

import { createInterpolatedPos } from '../materials/InterpolatedPos.js';
import { createUVMap } from '../materials/uvMap.js';

export class Lamp{
    constructor(position, color, intensity) {
        this.geometry = new THREE.SphereGeometry(.1,32,32);
        this.material = createUVMap();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(position.x, position.y, position.z);

        
        this.lightSource = {
            direction: new THREE.Vector3(0,0,0),
            color: color,
            intensity: intensity,
            position: this.mesh.position,
            isPointlight: true
        }


        if(this.material.uniforms.emittedLight){
            this.material.uniforms.emittedLight.value = {
                color: this.lightSource.color.toArray(),
                intensity: this.lightSource.intensity
           }
        }

    }


    update(delta){
        this.lightSource.position = this.mesh.position;
        if(this.material.uniforms.emittedLight){

         this.material.uniforms.emittedLight.value = {
             color: this.lightSource.color.toArray(),
             intensity: this.lightSource.intensity
         }
        }
    }
}