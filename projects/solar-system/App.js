import { Figure8_3Body } from "../../src/scenes/Figure8_3Body.js";
import { SolarSystem } from "../../src/scenes/SolarSystem.js";
class App {
    constructor() {
        this.scene = new SolarSystem();
        this.prevTime = 0; // Previous time stamp
        this.start();
    }

    start() {
        const animate = (time) => {
            requestAnimationFrame(animate);
            const currentTime = time * 0.001;
            const deltaTime = (currentTime - this.prevTime) *0.001;
            this.prevTime = currentTime;
            for(let i = 0; i < 100; i++){
                this.scene.physicsUpdate();
            }
            this.scene.update()
        };
        animate(0);
    }
}

new App ();