import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';
import { CelestialBody } from '../objects/Classes/CelestialBody.js';

import { OrbitControls } from"https://web.cs.manchester.ac.uk/three/three.js-master/examples/jsm/controls/OrbitControls.js"
import { Sun } from '../objects/Bodies/Sun.js';
import {Earth} from '../objects/Bodies/Earth.js';
import {Moon} from '../objects/Bodies/Moon.js';
import { EarthClouds } from '../objects/Bodies/EarthClouds.js';
import { Galaxy } from '../objects/Bodies/Galaxy.js';


export class SolarSystem {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            3000
        );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Improves quality

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // this.sun = new CelestialBody(new THREE.Vector3(0, 0, 0), 10);
        // this.earth = new CelestialBody(new THREE.Vector3(-385, 0, 0), 4);
        // this.moon = new CelestialBody(new THREE.Vector3(-387, 0, 0), 1);

        this.sun = new Sun(new THREE.Vector3(0,0,0));
        this.earth = new Earth(new THREE.Vector3(-385,0,0));
        this.earthClouds = new EarthClouds(new THREE.Vector3(-385,0,0));
        this.moon = new Moon(new THREE.Vector3(-387,0,0));
        this.galaxy = new Galaxy();
        this.scene.add(this.galaxy.mesh);

        const light = new THREE.PointLight( 0xffffff, 1, 300);
        light.castShadow = true;
        light.position.set( 0, 0, 0 );
        light.shadow.mapSize.width = 2048; // default
        light.shadow.mapSize.height = 2048; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 1000000; // default


        const ambient = new THREE.AmbientLight(0x0A0A0A);


        this.scene.add(ambient);
        this.scene.add( light );
        this.scene.add(this.sun.aura);

        this.camera.position.copy(this.sun.position.clone().sub(new THREE.Vector3(0,0,-200)))


        this.lines = []

        this.moon.setOrbitBody(this.earth, 10, 0.249, 1/12);
        this.earth.setOrbitBody(this.sun, 100, 0.4, 1)
        this.earthClouds.setOrbitBody(this.sun, 100, 0.4, 1)

        

        this.objects = [this.sun, this.earth, this.moon, this.earthClouds];

        this.moon.setTilt(Math.PI/2, 0.08970992, 0);
        this.earth.setTilt(Math.PI/2, 0, 0)
        this.earthClouds.setTilt(Math.PI/2, 0, 0)



        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.minDistance = 0;

        this.earth.setRotation(1/365, new THREE.Vector3(0, 0.917, -0.398))
        this.earthClouds.setRotation(2/365, new THREE.Vector3(0, 0.917, -0.598))

        this.moon.setRotation(1/12, new THREE.Vector3(0,1,0));
        this.sun.setRotation(1/13, new THREE.Vector3(0,1,0));

        for (let i = 0; i < this.objects.length; i++) {
            this.scene.add(this.objects[i].mesh);
        }

        this.cameraTarget = this.sun;
        this.cameraDistance = this.camera.position.distanceTo(this.cameraTarget.position);
        this.mousePos = new THREE.Vector2(0,0);
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('click', (event) => this.onMouseClick(event));
    }

    

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setLines(){
        this.lines.forEach(obj => {
            this.scene.remove(obj);
        })
        this.lines = []
        for(let i = 0; i < this.objects.length; i++){
            let obj = this.objects[i];
            if(obj.orbitPath !== null){
                this.scene.add(obj.orbitPath);
                this.lines.push(obj.orbitPath);
            }
        }
    }
    update(delta) {
        //this.camera.position.copy(this.body3.position.clone().add(new THREE.Vector3(0,0,1000)));
    
        this.setLines();
        for(let i = 0; i < this.objects.length; i++){
            let obj = this.objects[i];
            obj.update(delta);
        }
        //this.objects.forEach(obj => obj.update(delta * 100));
        this.controls.update(); 
        this.renderer.render(this.scene, this.camera);
        //this.camera.position.copy(this.sun.position.clone().sub(new THREE.Vector3(0,0,-200)))
    }

}
