import * as THREE from 'https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js';

let G = 1;  // Gravitational constant, for simplicity (you can scale as needed)
let timeStep = 1 / 100000;  // Time step for updates

export class CelestialBody {
    constructor(position, radius) {
        this.geometry = new THREE.SphereGeometry(radius, 32, 32);
        this.material = new THREE.MeshBasicMaterial({ 
            color: 0xffffff
         });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.position = position;
        this.mesh.position.copy(this.position);

        this.orbitPath = null;

        this.orbitalBody = null;  // The body this object is orbiting
        this.semiMajorAxis = 0;   // Semi-major axis
        this.eccentricity = 0;    // Orbital eccentricity
        this.orbitalPeriod = 0;   // Orbital period (in arbitrary units)
        this.timeElapsed = 0;     // Time since the start of the orbit

        this.xTilt = 0;
        this.zTilt = 0;
        this.yTilt = 0;

        this.rotationPeriod = null;
        this.rotationAxis = null;
    }

    setRotation(period, axis){
        this.rotationPeriod = period;
        this.rotationAxis = axis.clone().normalize();
    }

    updateRotation(deltaTime){
        if(this.rotationPeriod && this.rotationPeriod > 0){
            let angularSpeed = (2 * Math.PI) / this.rotationPeriod;
            let deltaAngle = angularSpeed * deltaTime;

            this.mesh.rotateOnAxis(this.rotationAxis, deltaAngle);
        }
    }

    setTilt(x,y,z){
        this.xTilt = x;
        this.zTilt = z;
        this.yTilt = y;
    }

    // Set the orbital parameters
    setOrbitBody(body, a, e, orbitalPeriod) {
        this.orbitalBody = body;  // Set the central body
        this.semiMajorAxis = a;
        this.eccentricity = e;
        this.orbitalPeriod = orbitalPeriod;
        this.timeElapsed = 0;
    }

    // Solve Kepler's Equation using Newton's method to find the eccentric anomaly
    solveKeplersEquation(M, e, tol = 1e-8) {
        let E = M;  // Initial guess for Eccentric Anomaly (use M as the initial guess)
        while (true) {
            // Kepler's Equation: M = E - e * sin(E)
            let f_E = E - e * Math.sin(E) - M;
            let f_prime_E = 1 - e * Math.cos(E);
            
            // Newton's method update
            let E_new = E - f_E / f_prime_E;
            
            // Convergence check
            if (Math.abs(E_new - E) < tol) {
                break;
            }
            E = E_new;
        }
        return E;
    }

    rotateAroundZ(axis, angle) {
        let cosAngle = Math.cos(angle);
        let sinAngle = Math.sin(angle);

        return new THREE.Vector3(
            axis.x * cosAngle - axis.y * sinAngle,
            axis.x * sinAngle + axis.y * cosAngle,
            axis.z
        );
    }

    // Rotate a vector around the Y-axis
    rotateAroundY(axis, angle) {
        let cosAngle = Math.cos(angle);
        let sinAngle = Math.sin(angle);

        return new THREE.Vector3(
            axis.x * cosAngle + axis.z * sinAngle,
            axis.y,
            -axis.x * sinAngle + axis.z * cosAngle
        );
    }

    rotateAroundX(axis, angle) {
        let cosAngle = Math.cos(angle);
        let sinAngle = Math.sin(angle);

        return new THREE.Vector3(
            axis.x,
            axis.y * cosAngle - axis.z * sinAngle,
            axis.y * sinAngle + axis.z * cosAngle
        );
}

    // Update the position of the celestial body based on the orbit
    updatePosition(deltaTime) {
        if (this.orbitalBody !== null) {
            // Calculate mean anomaly M(t) based on time elapsed
            let M = (2 * Math.PI / this.orbitalPeriod) * this.timeElapsed;

            // Solve for the eccentric anomaly E(t)
            let E = this.solveKeplersEquation(M, this.eccentricity);

            // Calculate the true anomaly theta(t)
            let theta = 2 * Math.atan(Math.sqrt((1 + this.eccentricity) / (1 - this.eccentricity)) * Math.tan(E / 2));

            // Calculate the orbital radius at the current true anomaly
            let r = this.semiMajorAxis * (1 - this.eccentricity * Math.cos(E));

            // Position relative to the central body (orbitalBody)

            let position = new THREE.Vector3(r * Math.cos(theta), r * Math.sin(theta), 0);

            position = this.rotateAroundZ(position, this.zTilt);
            position = this.rotateAroundY(position, this.yTilt);
            position = this.rotateAroundX(position, this.xTilt);



            this.position.copy(position.add(this.orbitalBody.position.clone()));

            // this.position.x = this.orbitalBody.position.x + r * Math.cos(theta);
            // this.position.y = this.orbitalBody.position.y + r * Math.sin(theta);
            // this.position.z = this.orbitalBody.position.z;  // Assuming motion in the XY-plane (can adjust for 3D orbits)
            


            // Increment time
            this.timeElapsed += deltaTime;
        }
    }

    

    update(deltaTime){
        this.updatePosition(deltaTime);
        this.updateRotation(deltaTime);
        this.getOrbitPoints(1/1000, this.orbitalPeriod * 1001);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    }

    saveData(){
        this.s1 = this.semiMajorAxis; 
        this.s2 = this.eccentricity;
        this.s3 = this.orbitalPeriod;
        this.s4 = this.timeElapsed;
        this.s5 = this.position.clone();
    }

    reloadData(){
        this.semiMajorAxis = this.s1;
        this.eccentricity = this.s2;
        this.orbitalPeriod = this.s3;
        this.timeElapsed = this.s4;
        this.position.copy(this.s5);
    }

    getOrbitPoints(timeStep, count){
        this.saveData();
        let points = []
        this.timeElapsed = 0;

        for(let i = 0; i < count; i++){
            this.updatePosition(timeStep);
            points.push(this.position.clone());
        }
        this.reloadData();

        let size = Math.sqrt(this.semiMajorAxis)* 1.5;

        const material = new THREE.LineDashedMaterial( { color: 0xffffff, linewidth: 10, dashSize: size, gapSize: size} );
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        let line = new THREE.Line(geometry, material);
        line.computeLineDistances();
        this.orbitPath = line;
    }
}
