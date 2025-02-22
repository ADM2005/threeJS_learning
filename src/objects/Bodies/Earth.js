import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';
import { CelestialBody } from '../Classes/CelestialBody.js';

export class Earth extends CelestialBody{
    constructor(position){
        super(position, 4);
        this.geometry = new THREE.SphereGeometry(4, 128, 128);

        const loader = new THREE.TextureLoader();
        var texture = loader.load('../../../public/textures/earth_texture.jpg');
        this.material = new THREE.MeshPhongMaterial({ 
            map: texture,
         });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
       
    }
}