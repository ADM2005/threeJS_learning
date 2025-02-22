import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';
import { CelestialBody } from '../Classes/CelestialBody.js';

const cloudRadius = .05;

export class EarthClouds extends CelestialBody{
    constructor(position){
        super(position, 4+cloudRadius);
        this.geometry = new THREE.SphereGeometry(4+cloudRadius, 128, 128);

        const loader = new THREE.TextureLoader();
        var texture = loader.load('../../../public/textures/earth_clouds.bmp');
        this.material = new THREE.MeshPhongMaterial({ 
            map: texture,
            alphaMap: texture,
            transparent: true
         });
         
        this.mesh = new THREE.Mesh(this.geometry, this.material);
       
    }
}