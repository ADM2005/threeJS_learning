import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';

export class Galaxy{
    constructor(){
        let geometry = new THREE.SphereGeometry(1000, 256,256);
        const loader = new THREE.TextureLoader();
        var texture = loader.load('../../../public/textures/milky_way.jpg');

        this.material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        })

        this.mesh = new THREE.Mesh(geometry, this.material);
    }
}