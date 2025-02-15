import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';

import { Sphere1 } from '../objects/Sphere1.js';

export class MainScene {
    constructor() {
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

        this.lights = [
            {
                direction: new THREE.Vector3(-1,-1,-1).normalize(),
                color: new THREE.Color(0xffffff),
                intensity: 1.0
            }
        ]
        this.objects = [
            new Sphere1()
        ]

        this.ambient = {
                color: new THREE.Color(0xffffff),
                intensity: .05
        }
        this.objects.forEach(obj => this.scene.add(obj.mesh));

        window.addEventListener('resize', () => this.onWindowResize());
        
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update(time) {
        this.updateLights();
        this.objects.forEach(obj => obj.update(time));
        this.renderer.render(this.scene, this.camera);
    }

    updateLights() {
        const lightData = this.lights.map(light => ({
            direction: light.direction.toArray(),
            color: light.color.toArray(),
            intensity: light.intensity
        }));

            // Pad the lightData array with null lights if there are fewer than 10
        const maxLights = 10; // Maximum number of lights allowed
        const paddedLightData = [...lightData];
        while (paddedLightData.length < maxLights) {
        // Push null lights (no direction, color, or intensity) to fill up the remaining spots
        paddedLightData.push({
                direction: [0.0, 0.0, 0.0],
                color: [0.0, 0.0, 0.0],
                intensity: 0.0
            });
        }


        // Update the light data only if the material has the 'lights' uniform
        this.objects.forEach(obj => {
            if (obj.mesh.material.uniforms && obj.mesh.material.uniforms.lights) {
                obj.mesh.material.uniforms.lights.value = paddedLightData;
                obj.mesh.material.uniforms.numLights.value = lightData.length;
            }
            if(obj.mesh.material.uniforms && obj.mesh.material.uniforms.ambient) {
                obj.mesh.material.uniforms.ambient.value = {
                    color: this.ambient.color.toArray(),
                    intensity: this.ambient.intensity
                };
            }
            //console.log(obj.mesh.material.uniforms);
        });

    }
}