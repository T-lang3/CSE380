import GameScene from "./GameScene";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Tiles_index, Tiles_string } from "../Utils/Tiles_enum";
import { Layers_enum } from "../Utils/Layers_enum";
import { SoundEvent } from "../Utils/SoundEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import TileManager from "../TileManager/TileManager";
import { Objective_Event } from "../Utils/Objective_Event";
import Input from "../../Wolfie2D/Input/Input";
import Level_2 from "./Level_2";
import Level_3 from "./Level_3";
import Level_4 from "./Level_4";
import Level_5 from "./Level_5";
import Level_6 from "./Level_6";


export default class Level_1 extends GameScene {

    loadScene(): void {
        // load sfx (desert, dirt, fire, water, rock)
        super.loadScene();

        // load tilemap
        this.load.tilemap("level_1", "Game_Resources/tilemaps/lvl_1.json");

        // load music, make sure the key is "level_music"
        this.load.audio("level_music", "Game_Resources/music/level1.mp3");
    }


    update(deltaT: number): void {
        // cheats
        if (Input.isKeyPressed('2')) {
            this.sceneManager.changeToScene(Level_2);
        } else if (Input.isKeyPressed('3')) {
            this.sceneManager.changeToScene(Level_3);
        } else if (Input.isKeyPressed('4')) {
            this.sceneManager.changeToScene(Level_4);
        } else if (Input.isKeyPressed('5')) {
            this.sceneManager.changeToScene(Level_5);
        } else if (Input.isKeyPressed('6')) {
            this.sceneManager.changeToScene(Level_6);
        }

        // fulfilled objectives        
        if (this.nextlevel == true){
            this.sceneManager.changeToScene(Level_2)
        }
        
        // proceed as normal
        super.update(deltaT);
    }


    startScene(): void {

        // music, events, ui
        super.startScene();

        console.log(this.Tiles);

        // level_1 tilemap
        this.addLayer(Layers_enum.TILES, 10);
        this.add.tilemap("level_1");
        let tilelayer = this.getLayer(Layers_enum.TILES);
        console.log(tilelayer);

        // initialize sets for different types of tiles
        console.log("레벨 초기화")
        let tile_arr = tilelayer.getItems();
        for (let i = 0; i < tile_arr.length; i++) {
            let tile_sprite = <AnimatedSprite>tile_arr[i];

            // level_1 starts with desert
            if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.DESERT) {
                this.Tiles[Tiles_index[Tiles_string.DESERT]].add(this.vec2ToString(tile_arr[i].position));
            }
        }

    }

}