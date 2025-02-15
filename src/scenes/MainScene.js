import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';

import { Sphere1 } from '../objects/Sphere1.js';
import { Lamp } from '../objects/Lamp.js';

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
            //  {
            //      direction: new THREE.Vector3(-1,-1,-1).normalize(),
            //      color: new THREE.Color(0xffffff),
            //      intensity: .5,
            //      position: new THREE.Vector3(0,0,0),
            //      isPointlight: false
            //  }

        ]
        this.l1 = new Lamp(new THREE.Vector3(5.38516,0,0), new THREE.Color(0xff0000), 2.0)
        this.l2 = new Lamp(new THREE.Vector3(5,3,0), new THREE.Color(0x00ff00), 2.0)
        this.l3 = new Lamp(new THREE.Vector3(5,-3,0), new THREE.Color(0x0000ff), 2.0)

        this.theta = Math.PI/2
        this.radius = 3.0
        this.spacing = Math.PI/6

        this.objects = [
            new Sphere1(),
            this.l1,
            this.l2,
            this.l3
        ]

        console.log(this.objects)
        this.ambient = {
                color: new THREE.Color(0xffffff),
                intensity: .01
        }

        this.objects.forEach(obj => this.scene.add(obj.mesh));
        console.log(this.scene);
        window.addEventListener("resize", () => this.onWindowResize());
    
        // Select sliders and attach event listeners
        this.metallicSlider = document.getElementById("metallic");
        this.smoothnessSlider = document.getElementById("smoothness");
    
        this.metallicSlider.addEventListener("input", () => this.updateMaterialProperties());
        this.smoothnessSlider.addEventListener("input", () => this.updateMaterialProperties());
    

        this.radiusSlider = document.getElementById("radius");
        this.radiusSlider.addEventListener("input", () => {this.radius = parseFloat(this.radiusSlider.value)})

        this.intensitySlider = document.getElementById("intensity");
        this.intensitySlider.addEventListener("input", () => {
            let sliderValue = parseFloat(this.intensitySlider.value);
            this.l1.lightSource.intensity = sliderValue;
            this.l2.lightSource.intensity = sliderValue;
            this.l3.lightSource.intensity = sliderValue;
        })

        this.spacingSlider = document.getElementById("spacing");
        console.log(this.spacingSlider);
        this.spacingSlider.addEventListener("input", () => {
            this.spacing = parseFloat(this.spacingSlider.value);
            console.log(this.spacing);
        })


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
    updateLightPosition(delta){
        this.theta += delta * 1000;
        let l1x = this.radius * Math.sin(this.theta);
        let l1y = this.radius * Math.cos(this.theta);

        let l2x = this.radius * Math.sin(this.theta + this.spacing);
        let l2y = this.radius * Math.cos(this.theta + this.spacing);

        let l3x = this.radius * Math.sin(this.theta - this.spacing);
        let l3y = this.radius * Math.cos(this.theta - this.spacing);
        
        this.l1.mesh.position.set(l1x,l1y,0);
        this.l2.mesh.position.set(l2x,l2y,0);
        this.l3.mesh.position.set(l3x,l3y,0);


    }
    update(time) {
        this.updateLightPosition(time);
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
            //console.log(obj.mesh.material.uniforms);
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

        this.objects.map(obj => {
            if(obj.lightSource){
                lightData.push({
                    direction: obj.lightSource.direction.toArray(),
                    color: obj.lightSource.color.toArray(),
                    intensity: obj.lightSource.intensity,
                    position: obj.lightSource.position.toArray(),
                    isPointLight: obj.lightSource.isPointlight
                })
            }
        })

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
            console.log(obj.mesh.material.uniforms);
        });

    }
}