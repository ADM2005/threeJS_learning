import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';

import { Cuboid } from '../objects/Cuboid.js';

export class SimpleShading {
    constructor(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth/window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0,0,5);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this.renderer.domElement);

        this.objects = [
            new Cuboid(),
        ]
        this.objects.forEach(obj => this.scene.add(obj.mesh));

        window.addEventListener('resize', () => this.onWindowResize());
    }

    onWindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update(delta){
        this.objects.forEach(obj => obj.update(delta));
        this.renderer.render(this.scene, this.camera);
    }
}