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
            // {
            //     direction: new THREE.Vector3(-1,-1,-1).normalize(),
            //     color: new THREE.Color(0xffffff),
            //     intensity: 1.0,
            //     position: new THREE.Vector3(0,0,0),
            //     isPointlight: false
            // },
            {
                direction: new THREE.Vector3(0,0,0),
                color: new THREE.Color(0xff0000),
                intensity: 1,
                position: new THREE.Vector3(5.38516,0,0),
                isPointlight: true
            },
            {
                direction: new THREE.Vector3(0,0,0),
                color: new THREE.Color(0x00ff00),
                intensity: 1,
                position: new THREE.Vector3(5,3,0),
                isPointlight: true
            },
            {
                direction: new THREE.Vector3(0,0,0),
                color: new THREE.Color(0x0000ff),
                intensity: 1,
                position: new THREE.Vector3(5,-3,0),
                isPointlight: true
            }
        ]
        this.objects = [
            new Sphere1()
        ]

        this.ambient = {
                color: new THREE.Color(0xffffff),
                intensity: .01
        }

        this.objects.forEach(obj => this.scene.add(obj.mesh));

        window.addEventListener("resize", () => this.onWindowResize());
    
        // Select sliders and attach event listeners
        this.metallicSlider = document.getElementById("metallic");
        this.smoothnessSlider = document.getElementById("smoothness");
    
        this.metallicSlider.addEventListener("input", () => this.updateMaterialProperties());
        this.smoothnessSlider.addEventListener("input", () => this.updateMaterialProperties());
    
        this.updateMaterialProperties(); // Set initial values

        this.objects.forEach(obj => this.scene.add(obj.mesh));

        window.addEventListener('resize', () => this.onWindowResize());
        
    }

    updateMaterialProperties(){
        const metallicValue = parseFloat(this.metallicSlider.value);
        const smoothnessValue = parseFloat(this.smoothnessSlider.value);
    
        document.getElementById("metallicValue").innerText = metallicValue.toFixed(2);
        document.getElementById("smoothnessValue").innerText = smoothnessValue.toFixed(2);
    
        this.objects.forEach(obj => {
            if (obj.mesh.material.uniforms.metallic) {
                obj.mesh.material.uniforms.metallic.value = metallicValue;
            }
            if (obj.mesh.material.uniforms.smoothness) {
                obj.mesh.material.uniforms.smoothness.value = smoothnessValue;
            }
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update(time) {
        this.updateCameraPosition();
        this.updateLights();
        this.objects.forEach(obj => obj.update(time));
        this.renderer.render(this.scene, this.camera);
    }

    updateCameraPosition(){
        this.objects.forEach(obj => {
            if(obj.mesh.material.uniforms.worldSpaceCameraPosition){
                obj.mesh.material.uniforms.worldSpaceCameraPosition.value = this.camera.position.toArray();
            }
            console.log(obj.mesh.material.uniforms)
        })
    }

    updateLights() {
        const lightData = this.lights.map(light => ({
            direction: light.direction.toArray(),
            color: light.color.toArray(),
            intensity: light.intensity,
            position: light.position.toArray(),
            isPointLight: light.isPointlight
        }));

            // Pad the lightData array with null lights if there are fewer than 10
        const maxLights = 10; // Maximum number of lights allowed
        const paddedLightData = [...lightData];
        while (paddedLightData.length < maxLights) {
        // Push null lights (no direction, color, or intensity) to fill up the remaining spots
        paddedLightData.push({
                direction: [0.0, 0.0, 0.0],
                color: [0.0, 0.0, 0.0],
                intensity: 0.0,
                position: [0.0,0.0,0.0],
                isPointLight: false
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