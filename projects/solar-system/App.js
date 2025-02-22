import { Figure8_3Body } from "../../src/scenes/Figure8_3Body.js";
import { SolarSystem } from "../../src/scenes/SolarSystem.js";
class App {
    constructor() {
        this.scene = new SolarSystem();
        this.prevTime = 0; // Previous time stamp

        this.speed = 1;
        this.relative = 1;

        this.simSpeed = document.getElementById('simSpeed');
        this.simSpeed.addEventListener('input', () => {
            let speed = parseFloat(this.simSpeed.value);
            if(speed){
                this.speed = speed;
            }

        })

        this.relativeTo = document.getElementById('relativeTo');
        this.relativeTo.addEventListener('change', () => {
            let relative = parseFloat(this.relativeTo.value);
            this.relative = relative;
        })

        this.start();

    }

    parseInputs(){
        let speed = parseFloat(this.simSpeed.value);
        if(speed){
            this.speed = speed;
        }
        let relative = parseFloat(this.relativeTo.value);
        this.relative = relative;
    }

    start() {
        this.parseInputs();
        const animate = (time) => {
            requestAnimationFrame(animate);
            const currentTime = time * 0.001;
            const deltaTime = (currentTime - this.prevTime);
            this.prevTime = currentTime;
            this.scene.update(deltaTime * (this.speed / this.relative))
        };
        animate(0);
    }

}

new App ();