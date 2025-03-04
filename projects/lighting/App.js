import { LightingScene } from "../../src/scenes/LightingScene.js";

class App {
    constructor() {
        this.scene = new LightingScene();
        this.prevTime = 0; // Previous time stamp
        this.start();
    }

    start() {
        const animate = (time) => {
            requestAnimationFrame(animate);
            const currentTime = time * 0.001;
            const deltaTime = (currentTime - this.prevTime) *0.001;
            this.prevTime = currentTime;
            this.scene.update(deltaTime);
        };
        animate(0);
    }
}

new App ();