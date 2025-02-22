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
    addAtmosphere(camera) {
        this.camera = camera;
        const atmosphereGeometry = new THREE.SphereGeometry(4.4, 256, 256); // Slightly larger
        const atmosphereMaterial = new THREE.ShaderMaterial({
            uniforms: {
                fresnelColor: { value: new THREE.Color(0x66ccff) }, // Blue glow
                cameraPosition: { value: camera.position }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vViewPosition = normalize(cameraPosition - position);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 fresnelColor;
                varying vec3 vNormal;
                varying vec3 vViewPosition;

                void main() {
                    float fresnel = pow(1.0 - dot(vNormal, vViewPosition), 9.0);
                    gl_FragColor = vec4(fresnelColor, fresnel * 0.5);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide, // Renders inside-out for the atmospheric effect
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

        this.mesh.add(this.atmosphereMesh);
    }

    update(deltaTime){
        this.atmosphereMesh.material.uniforms.cameraPosition.value = this.camera.position.toArray()
        super.update(deltaTime);
    }
}