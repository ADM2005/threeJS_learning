import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';
import { CelestialBody } from '../Classes/CelestialBody.js';

export class Sun extends CelestialBody{
    constructor(position){
        super(position, 10)
        this.geometry = new THREE.SphereGeometry(10, 32, 32);

        const loader = new THREE.TextureLoader();
        var texture = loader.load('../../../public/textures/sun.jpg');

        this.material = new THREE.MeshStandardMaterial({ 
            emissive: 0xffd700,
            emissiveMap: texture,
            emissiveIntensity: 1,
            wireframe: false
         });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
       

        var glowTexture = loader.load('../../../public/textures/radial_glow.bmp');

        const spriteMaterial = new THREE.SpriteMaterial({
            map: glowTexture,                     // Use the same texture as the Sun
            color: 0xffd700,                  // Glow color
            transparent: true,                // Make it transparent for glow effect
            opacity: 0.5,                     // Adjust the opacity of the aura
            blending: THREE.AdditiveBlending, // Use additive blending to create a glowing effect
            depthTest: true,                 // Disable depth test to always render in front
        });
        
        // Create sprite for the aura
        this.aura = new THREE.Sprite(spriteMaterial);
        this.aura.scale.set(30, 30, 1); // Scale the aura to be bigger than the Sun

        // Position the aura at the same position as the Sun
        this.aura.position.copy(this.mesh.position);

        this.elapsed = 0;
    }

    update(deltaTime){
        this.elapsed += deltaTime;
        super.update(deltaTime);
        let scaleValue = 40 + 5 * Math.sin(30 * this.elapsed);
        this.aura.scale.set(scaleValue, scaleValue, 1);
    }
}