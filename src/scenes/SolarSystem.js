import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';
import { CelestialBody } from '../objects/Classes/CelestialBody.js';

export class SolarSystem {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 45);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);


        this.body2 = new CelestialBody(new THREE.Vector3(-32, 0, 0), 1000000, new THREE.Vector3(0, 573.5, 0));
        this.body1 = new CelestialBody(new THREE.Vector3(-30, 0, 0), 1, new THREE.Vector3(0, 573.5+Math.sqrt(this.body2.mass/2), 0));

        this.body3 = new CelestialBody(new THREE.Vector3(0, 0, 0), 10000000, new THREE.Vector3(0, 0, 0));

        this.objects = [this.body1, this.body2, this.body3];

        for (let i = 0; i < this.objects.length; i++) {
            this.scene.add(this.objects[i].mesh);
        }

        this.body1Orbit = this.body1.calculateOrbitalPathRelative(this.objects, 100000, this.body3);
        this.body2Orbit = this.body2.calculateOrbitalPathRelative(this.objects, 100000, this.body3);
        this.body3Orbit = this.body3.calculateOrbitalPathRelative(this.objects, 100000, this.body3);

        this.renderLine(this.body1Orbit, 0x0000ff);
        this.renderLine(this.body2Orbit, 0xff0000);
        this.renderLine(this.body3Orbit, 0x00ff00);

        window.addEventListener('resize', () => this.onWindowResize());
    }

    renderLine(positions, color) {
        let material = new THREE.LineBasicMaterial({ color: color });
        const geometry = new THREE.BufferGeometry().setFromPoints(positions);
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    physicsUpdate(){
        this.relative();
        this.updateForces();
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].update(1/10000);
        }
    }
    relative(){
        this.objects.forEach( (obj) => {
            obj.position.copy(obj.position.clone().sub(this.body3.position))
        } )
    }

    update(delta) {
        //this.camera.position.copy(this.body3.position.clone().add(new THREE.Vector3(0,0,1000)));
        this.updateForces();
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].update(1/10000);
        }
        this.renderer.render(this.scene, this.camera);
    }

    updateForces() {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].calculateResultantForce(this.objects);
        }
    }
}
