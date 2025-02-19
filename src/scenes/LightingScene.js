import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';

import { Sphere1 } from '../objects/Sphere1.js';
import { Lamp } from '../objects/Lamp.js';

export class LightingScene {
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
        this.theta = Math.PI/2

        this.radius = 3.0
        this.spacing = Math.PI/6

        this.axis = new THREE.Vector3(0,1,0).normalize();
        this.axisAngle = Math.PI/3;

        this.initialiseHTMLElements();  
        this.getHTMLData();

        this.lamps = [];

        this.objects = [
            new Sphere1(),
        ]

        this.createLamps()


        console.log(this.objects)
        this.ambient = {
                color: new THREE.Color(0xffffff),
                intensity: .01
        }

        this.objects.forEach(obj => this.scene.add(obj.mesh));
        console.log(this.scene);
        window.addEventListener("resize", () => this.onWindowResize());
    
        // Select sliders and attach event listeners

        this.updateMaterialProperties(); // Set initial values

        this.objects.forEach(obj => this.scene.add(obj.mesh));


        window.addEventListener('resize', () => this.onWindowResize());
        
    }

    initialiseHTMLElements(){
        this.metallicSlider = document.getElementById("metallic");
        this.smoothnessSlider = document.getElementById("smoothness");
    
        this.metallicSlider.addEventListener("input", () => this.updateMaterialProperties());
        this.smoothnessSlider.addEventListener("input", () => this.updateMaterialProperties());
    

        this.radiusSlider = document.getElementById("radius");
        this.radiusSlider.addEventListener("input", () => {this.radius = parseFloat(this.radiusSlider.value)})

        this.intensitySlider = document.getElementById("intensity");
        this.intensitySlider.addEventListener("input", () => {
            let sliderValue = parseFloat(this.intensitySlider.value);
            this.updateLightIntensity(sliderValue);
        })

        this.spacingSlider = document.getElementById("spacing");
        this.spacingSlider.addEventListener("input", () => {
            this.spacing = parseFloat(this.spacingSlider.value)/Math.max(this.lightCount,1);
            console.log(this.spacing);
        })

        this.lightCountElement = document.getElementById("lightCount");
        this.lightCountElement.addEventListener("input", () => {
            let count = parseInt(this.lightCountElement.value);
            this.lightCount = count;
            this.spacing = parseFloat(this.spacingSlider.value)/count;
            this.createLamps();
        })
        
        this.startColorElement = document.getElementById("startColor");
        this.startColorElement.addEventListener("input", () => {
            let color = new THREE.Color(this.startColorElement.value);
            this.startColor = color;
            console.log(this.startColor);
            this.createLamps();
        })

        this.endColorElement = document.getElementById("endColor");
        this.endColorElement.addEventListener("input", () => {
            let color = new THREE.Color(this.endColorElement.value);
            this.endColor = color;
            console.log(this.endColor);
            this.createLamps();
        })

        this.axisAngleSlider = document.getElementById("axisAngle");
        this.axisAngleSlider.addEventListener("input", () => {
            this.axisAngle = parseFloat(this.axisAngleSlider.value);
        })

        this.axisVectorXInput = document.getElementById("axisVectorX");
        this.axisVectorYInput = document.getElementById("axisVectorY");
        this.axisVectorZInput = document.getElementById("axisVectorZ");

        this.axisVectorXInput.addEventListener("input", () => {
            this.updateAxisVector()
        })
        this.axisVectorYInput.addEventListener("input", () => {
            this.updateAxisVector()
        })
        this.axisVectorZInput.addEventListener("input", () => {
            this.updateAxisVector()
        })
    }

    updateAxisVector(){
        this.axis = new THREE.Vector3(this.axisVectorXInput.value, this.axisVectorYInput.value, this.axisVectorZInput.value).normalize()
        console.log(this.axis);
    }

    getHTMLData(){
        this.intensity = parseFloat(this.intensitySlider.value);
        this.lightCount = parseInt(this.lightCountElement.value);
        this.spacing = parseFloat(this.spacingSlider.value)/this.lightCount;
        this.startColor = new THREE.Color(this.startColorElement.value);
        this.endColor = new THREE.Color(this.endColorElement.value);
        this.axisAngle = parseFloat(this.axisAngleSlider.value);
        this.updateAxisVector();
    }
    createLamps(){
        let difference = this.objects.filter(x => !this.lamps.includes(x));
        this.lamps.map( (lamp) => {
            this.scene.remove(lamp.mesh);
        } )
        this.lamps = [];
        this.objects = difference;
        for(let i = 0; i < this.lightCount; i++){
            let lamp = new Lamp(
                new THREE.Vector3(this.radius * Math.sin(this.theta + i * this.spacing), this.radius * Math.cos(this.theta + i * this.spacing)),
                //this.startColor.lerp(this.endColor, i/(this.lightCount-1)),
                this.startColor.clone().lerp(this.endColor, i/(  Math.max(this.lightCount-1, 1)  )  ),
                this.intensity
            )

            this.scene.add(lamp.mesh);
            this.lamps.push(lamp);
        }
        this.lamps.map((lamp) => {
            this.objects.push(lamp);
        })
    }
    updateLightIntensity(intensity){
        this.intensity = intensity;
        this.lamps.map( (lamp) => {
            lamp.lightSource.intensity = intensity;
        } )
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
        for(let i = 0; i < this.lightCount; i++){
            let lamp = this.lamps[i];
            let x = this.radius * Math.sin(this.theta + i * this.spacing);
            let y = this.radius * Math.cos(this.theta + i * this.spacing);

            let pos = new THREE.Vector3(x,y,0);
            pos.applyAxisAngle(this.axis, this.axisAngle);
            lamp.mesh.position.set(pos.x,pos.y,pos.z);

        }
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
        const maxLights = 100; // Maximum number of lights allowed
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