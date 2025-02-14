import { MainScene } from "./scenes/MainScene.js";

class App {
    constructor() {
        this.scene = new MainScene();
        this.start();
    }

    start() {
        const animate = (time) => {
            requestAnimationFrame(animate);
            this.scene.update(time * 0.001);
        };
        animate(0);
    }
}

new App ();