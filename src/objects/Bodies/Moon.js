import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';
import { CelestialBody } from '../Classes/CelestialBody.js';

export class Moon extends CelestialBody{
    constructor(position){
        super(position, 1);
        this.geometry = new THREE.SphereGeometry(1, 32, 32);

        const loader = new THREE.TextureLoader();
        var texture = loader.load('../../../public/textures/moon.jpg');
        
        this.material = new THREE.MeshPhongMaterial({ 
            map: texture,
         });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
       
    }
}