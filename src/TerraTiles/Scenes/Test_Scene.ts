import Scene from "../../Wolfie2D/Scene/Scene";

export default class Test_Scene extends Scene {

    public loadScene() {
        // Load tilemap
        this.load.tilemap("tilemap", "Game_Resources/tilemaps/test_3.json");

        // Load tile animations
    }

    public override startScene() {
        // keep in order
        this.addLayer("tiles", 10);
        let tilemap = this.add.tilemap("tilemap");
            // change size/scale later
            // I think that the right side of the tilemap is cut off   

    }

}