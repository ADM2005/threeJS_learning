import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';
let G = 1

let timeStep = 1/100000

export class CelestialBody {
    constructor(position, mass, vel_init) {
        this.geometry = new THREE.SphereGeometry(.1, 32, 32);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.position = position;
        this.mesh.position.set(position.x, position.y, position.z);
        this.previousPosition = this.position.clone().sub(vel_init.clone());
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.velocity = vel_init.clone();
        this.mass = mass;
    }

    startSimulation() {
        this.savedPosition = this.position.clone();
        this.savedPreviousPosition = this.previousPosition.clone();
        this.savedAcceleration = this.acceleration.clone();
        this.savedVelocity = this.velocity.clone();
        this.savedMass = this.mass;
    }

    endSimulation() {
        this.position = this.savedPosition.clone();
        this.previousPosition = this.savedPreviousPosition.clone();
        this.acceleration = this.savedAcceleration.clone();
        this.velocity = this.savedVelocity.clone();
        this.mass = this.savedMass;
    }

    step(deltaTime){
        //this.verletStep(deltaTime)
        //this.eulerStep(deltaTime);
        this.eulerStep(deltaTime)
    }

    eulerStep(deltaTime){
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        this.velocity.add(this.acceleration.clone().multiplyScalar(deltaTime));
    }
    verletStep(deltaTime) {
        let half_dt2 = 0.5 * deltaTime * deltaTime;
        
        // Update position
        let newPosition = this.position.clone()
            .add(this.velocity.clone().multiplyScalar(deltaTime))
            .add(this.acceleration.clone().multiplyScalar(half_dt2));
    
        // Update velocity (store previous acceleration before updating)
        let oldAcceleration = this.acceleration.clone();
    
        // Reset acceleration for next force calculation step
        this.acceleration.set(0, 0, 0);
    
        // Apply new position
        this.previousPosition = this.position.clone();
        this.position.copy(newPosition);
    
        // Compute new acceleration AFTER forces are applied
        this.velocity.add(oldAcceleration.clone().multiplyScalar(0.5 * deltaTime));
    }

    leapFrogStep(deltaTime){
        this.velocity.add(this.acceleration.clone().multiplyScalar(0.5 * deltaTime));
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

        //this.velocity.add(this.acceleration.clone().multiplyScalar(0.5 * deltaTime));
        //this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    }
    
    update(deltaTime) {
        this.step(timeStep);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    }

    applyForce(force) {
        this.acceleration = force.clone().multiplyScalar(1 / this.mass);
    }

    calculateResultantForce(bodies) {
        let force = new THREE.Vector3(0,0,0);
        for (let i = 0; i < bodies.length; i++) {
            let obj = bodies[i];
            if (obj !== this) {
                force = force.add(calculateGravitationalForce(this, obj));
            }
        }
        this.applyForce(force.clone());
    }

    calculateOrbitalPath(bodies, steps) {
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].startSimulation();
        }

        let positions = [this.position.clone()];
        for (let i = 0; i < steps; i++) {
            bodies.map( (body) => {
                body.calculateResultantForce(bodies);
            } )
            for (let j = 0; j < bodies.length; j++) {
                bodies[j].step(timeStep);
            }
            positions.push(this.position.clone());
        }

        for (let i = 0; i < bodies.length; i++) {
            bodies[i].endSimulation();
        }

        return positions;
    }
    calculateOrbitalPathRelative(bodies, steps, relativeTo) {
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].startSimulation();
        }

        let positions = [this.position.clone()];
        for (let i = 0; i < steps; i++) {
            bodies.map( (body) => {
                body.calculateResultantForce(bodies);
            } )
            for (let j = 0; j < bodies.length; j++) {
                bodies[j].step(timeStep);
            }
            positions.push(this.position.clone().sub(relativeTo.position))
        }

        for (let i = 0; i < bodies.length; i++) {
            bodies[i].endSimulation();
        }

        return positions;
    }
}

function calculateGravitationalForce(body1, body2) {
    let b1b2 = body2.position.clone().sub(body1.position);
    let r = b1b2.length();
    b1b2.normalize();
    let magnitude = G * body1.mass * body2.mass / (r * r);
    return b1b2.clone().multiplyScalar(magnitude);
}
