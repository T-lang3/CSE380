import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Scene from "../../Wolfie2D/Scene/Scene";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Tiles_string, Tiles_index, TileMatrix, Tile_manage } from "../Utils/Tiles_enum";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import { Layers_enum } from "../Utils/Layers_enum";
import Color from "../../Wolfie2D/Utils/Color";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { SoundEvent } from "../Utils/SoundEvent";
import TileManager from "../TileManager/TileManager";
import ObjectivesManager from "../ObjectivesBar/ObjectivesManager";
import { Objective_Event } from "../Utils/Objective_Event";
import MainMenu from "./MainMenu";


export default class GameScene extends Scene {
    // protected tilemap: OrthogonalTilemap;
    // changed Vec2 to String, because It can't campare between Vec2 objects when deleting tiles.
    protected Tiles: Set<String>[] = [];//uses Tiles_index for array, so desert is 0, grass is 1, ...
    protected TilesTimer: Map<String, number>[] = [];
    protected roundDelay: number;
    protected roundTimer: number;
    protected currentMode: string = Tiles_string.DESERT; // temporarily set the tile mode, default mode is DESERT
    protected pause: boolean;
    protected pause_box: Graphic
    protected pause_button: Button
    protected tile_manager: TileManager
    protected objectives_bar: ObjectivesManager
    protected nextlevel: Boolean
    protected clicktilepos: Vec2

    // method for comparing tiles' positions
    vec2ToString(vec: Vec2): string {
        return `${vec.x}:${vec.y}`;
    }
    stringToVec2(s: String): Vec2 {
        const [x, y] = s.split(':').map(Number);
        return new Vec2(x, y);
    }


    growGrassFromDirt(deltaT: number) {

        for (let dirtTile of this.Tiles[Tiles_index[Tiles_string.DIRT]]) {
            let tileTimer = this.getTileTimer(Tiles_index[Tiles_string.DIRT], this.stringToVec2(dirtTile));
    
            if (tileTimer <= 0) {
                this.initializeTileTimer(Tiles_index[Tiles_string.DIRT], this.stringToVec2(dirtTile), 3); 

                let pos = this.stringToVec2(dirtTile);
                let vec2ToString = this.vec2ToString(pos);

                let nodes = this.sceneGraph.getNodesAt(pos);
                
                for (let node of nodes) {
                    if (node instanceof AnimatedSprite) {
                        let animatedSprite = node as AnimatedSprite;
                        if (animatedSprite.animation.getcurrentAnimation().valueOf() == Tiles_string.DIRT) {
                            animatedSprite.animation.playIfNotAlready(Tiles_string.GRASS, true);
                            this.Tiles[Tiles_index[Tiles_string.GRASS]].add(vec2ToString);    
                            this.Tiles[Tiles_index[Tiles_string.DIRT]].delete(vec2ToString);                        
                            break;
                        }
                        this.Tiles[Tiles_index[Tiles_string.DIRT]].delete(vec2ToString);
                    }
                }
            }else {
                tileTimer -= deltaT;
                this.initializeTileTimer(Tiles_index[Tiles_string.DIRT], this.stringToVec2(dirtTile), tileTimer);
            }
        }

    }

    spreadWater(deltaT: number) {
        [Tiles_string.W_UP, Tiles_string.W_DOWN, Tiles_string.W_LEFT, Tiles_string.W_RIGHT].forEach(waterType => {
            const newWaterTiles: Set<String> = new Set<String>();
            const direction = this.getWaterDirection(waterType);
    
            for (let waterTile of this.Tiles[Tiles_index[waterType]]) {
                let tileTimer = this.getTileTimer(Tiles_index[waterType], this.stringToVec2(waterTile));
    
                if (tileTimer <= 0) {
                    this.initializeTileTimer(Tiles_index[waterType], this.stringToVec2(waterTile), 3); 
    
                    let originPos = this.stringToVec2(waterTile);
                    let newPos = new Vec2(originPos.x + direction.dx * 32, originPos.y + direction.dy * 32);
                    let vec2ToString = this.vec2ToString(newPos);
    
                    let nodes = this.sceneGraph.getNodesAt(newPos);
                    for (let node of nodes) {
                        if (node instanceof AnimatedSprite) {
                            let animated_sprite = node as AnimatedSprite;
                            let animation_string = animated_sprite.animation.getcurrentAnimation().valueOf();
    
                            if (TileMatrix[waterType][animation_string] === 1) {
                                animated_sprite.animation.playIfNotAlready(waterType, true);
                                newWaterTiles.add(vec2ToString);
                                this.Tiles[Tiles_index[animation_string]].delete(vec2ToString);
                                this.TilesTimer[Tiles_index[animation_string]].delete(vec2ToString);
                            }
                        }
                    }
                } else {
                    tileTimer -= deltaT;
                    this.initializeTileTimer(Tiles_index[waterType], this.stringToVec2(waterTile), tileTimer);
                }
            }
            this.Tiles[Tiles_index[waterType]] = new Set<String>([...this.Tiles[Tiles_index[waterType]], ...newWaterTiles]);
        });
    }
    
    getWaterDirection(waterType: string) {
        switch (waterType) {
            case Tiles_string.W_UP:
                return { dx: 0, dy: -1 };
            case Tiles_string.W_DOWN:
                return { dx: 0, dy: 1 };
            case Tiles_string.W_LEFT:
                return { dx: -1, dy: 0 };
            case Tiles_string.W_RIGHT:
                return { dx: 1, dy: 0 };
            default:
                return { dx: 0, dy: 0 }; 
        }
    }

    spreadDisease(deltaT: number) {
        const newDiseaseTiles: Set<String> = new Set<String>();

        for (let diseaseTile of this.Tiles[Tiles_index[Tiles_string.DISEASE]]) {
            
            let tileTimer = this.getTileTimer(Tiles_index[Tiles_string.DISEASE], this.stringToVec2(diseaseTile));
            if (tileTimer <= 0) {
                this.initializeTileTimer(Tiles_index[Tiles_string.DISEASE], this.stringToVec2(diseaseTile), 3); 
                const directions = [
                    { dx: 1, dy: 1 },
                    { dx: 1, dy: -1 },
                    { dx: -1, dy: 1 },
                    { dx: -1, dy: -1 }
                ];

                for (let {dx, dy} of directions) {
                    let originPos = this.stringToVec2(diseaseTile);
                    let newPos = new Vec2(originPos.x + dx * 32, originPos.y + dy * 32);
                    let vec2ToString = this.vec2ToString(newPos);

                    let nodes = this.sceneGraph.getNodesAt(newPos);
                    for (let node of nodes) {
                        if (node instanceof AnimatedSprite) {
                            let animated_sprite = node as AnimatedSprite;
                            let animation_string = animated_sprite.animation.getcurrentAnimation().valueOf();

                            if (TileMatrix[Tiles_string.DISEASE][animation_string] === 1) {
                                animated_sprite.animation.playIfNotAlready(Tiles_string.DISEASE, true);
                                newDiseaseTiles.add(vec2ToString);
                                this.Tiles[Tiles_index[animation_string]].delete(vec2ToString);
                                this.TilesTimer[Tiles_index[animation_string]].delete(vec2ToString);
                            }
                        }
                    }
                }
            } else {
                tileTimer -= deltaT;
                this.initializeTileTimer(Tiles_index[Tiles_string.DISEASE], this.stringToVec2(diseaseTile), tileTimer);
            }
        }
        this.Tiles[Tiles_index[Tiles_string.DISEASE]] = new Set<String>([...this.Tiles[Tiles_index[Tiles_string.DISEASE]], ...newDiseaseTiles]);
    }
    
    
    
    
    
    spreadFire(deltaT: number) {
        const newFireTiles: Set<String> = new Set<String>();
        let deletedFireTiles = false;
        for (let fireTile of this.Tiles[Tiles_index[Tiles_string.FIRE]]) {
            let tileTimer = this.getTileTimer(Tiles_index[Tiles_string.FIRE], this.stringToVec2(fireTile));
            tileTimer -= deltaT;
    
            if (tileTimer <= 2 && tileTimer + deltaT > 2) {
                const directions = [
                    { dx: 0, dy: -1 },
                    { dx: 1, dy: 0 },
                    { dx: 0, dy: 1 },
                    { dx: -1, dy: 0 }
                ];
    
                for (let {dx, dy} of directions) {
                    let originPos = this.stringToVec2(fireTile);
                    let newPos = new Vec2(originPos.x + dx * 32, originPos.y + dy * 32);
                    let vec2ToString = this.vec2ToString(newPos);
        
                    let nodes = this.sceneGraph.getNodesAt(newPos);
                    for (let node of nodes) {
                        if (node instanceof AnimatedSprite){
                            let animated_sprite = node as AnimatedSprite;
                            let animation_string = animated_sprite.animation.getcurrentAnimation().valueOf();
                            if (animation_string == Tiles_string.W_UP || animation_string == Tiles_string.W_DOWN || animation_string == Tiles_string.W_LEFT || animation_string == Tiles_string.W_RIGHT){
                                animated_sprite.animation.playIfNotAlready(Tiles_string.DIRT, true);
                                this.Tiles[Tiles_index[Tiles_string.DIRT]].add(vec2ToString);
                                this.Tiles[Tiles_index[animation_string]].delete(vec2ToString);

                            } else if (animation_string == Tiles_string.DIRT) {
                                animated_sprite.animation.playIfNotAlready(Tiles_string.FIRE, true);
                                newFireTiles.add(vec2ToString);
                            } else if (animation_string == Tiles_string.GRASS) {
                                animated_sprite.animation.playIfNotAlready(Tiles_string.FIRE, true);
                                newFireTiles.add(vec2ToString);
                            } else if (animation_string == Tiles_string.MUD) {
                                animated_sprite.animation.playIfNotAlready(Tiles_string.DIRT, true);
                                this.Tiles[Tiles_index[Tiles_string.DIRT]].add(fireTile);

                            } else if (animation_string == Tiles_string.HOUSE){
                                animated_sprite.animation.playIfNotAlready(Tiles_string.FIRE, true);
                                newFireTiles.add(vec2ToString);
                            } else if (animation_string == Tiles_string.DISEASE){
                                animated_sprite.animation.playIfNotAlready(Tiles_string.FIRE, true);
                                newFireTiles.add(vec2ToString);
                            }
                        }
                    }
                }
            }
    
            if (tileTimer <= 0) {
                let nodes = this.sceneGraph.getNodesAt(this.stringToVec2(fireTile));
                for (let node of nodes) {
                    if (node instanceof AnimatedSprite) {
                        let animated_sprite = node as AnimatedSprite;
                        animated_sprite.animation.playIfNotAlready(Tiles_string.DESERT, true);
                        this.Tiles[Tiles_index[Tiles_string.DESERT]].add(fireTile);
                        this.Tiles[Tiles_index[Tiles_string.FIRE]].delete(fireTile);
                        this.TilesTimer[Tiles_index[Tiles_string.FIRE]].delete(fireTile);
                        deletedFireTiles = true
                    }
                }
                
            } else {
                this.initializeTileTimer(Tiles_index[Tiles_string.FIRE], this.stringToVec2(fireTile), tileTimer);
            }
        }
    
        this.Tiles[Tiles_index[Tiles_string.FIRE]] = new Set<String>([...this.Tiles[Tiles_index[Tiles_string.FIRE]], ...newFireTiles]);
        
        if (newFireTiles.size > 0 || deletedFireTiles){
            this.emitter.fireEvent(Objective_Event.FIRESIZE, {size: this.Tiles[Tiles_index[Tiles_string.FIRE]].size});
        }
    }
    

    initializeTileTimer(tileType: number, tilePos: Vec2, countdown: number) {
        const tileKey = this.vec2ToString(tilePos);
        if (!this.TilesTimer[tileType]) {
            this.TilesTimer[tileType] = new Map<String, number>();
        }
        this.TilesTimer[tileType].set(tileKey, countdown);
    }

    getTileTimer(tileType: number, tilePos: Vec2): number {
        const tileKey = this.vec2ToString(tilePos);
        if (tileType == Tiles_index[Tiles_string.FIRE])
            return this.TilesTimer[tileType]?.get(tileKey) || 5;  
        else if (tileType == Tiles_index[Tiles_string.W_UP] || tileType == Tiles_index[Tiles_string.W_DOWN] || tileType == Tiles_index[Tiles_string.W_LEFT] || tileType == Tiles_index[Tiles_string.W_RIGHT])
            return this.TilesTimer[tileType]?.get(tileKey) || 2; 
        else
            return this.TilesTimer[tileType]?.get(tileKey) || 3; 
    }

    protected subscribeToEvents(){
        this.receiver.subscribe([
            Tiles_string.DESERT,
            Tiles_string.DIRT,
            Tiles_string.FIRE,
            Tiles_string.W_UP,
            Tiles_string.ROCK,
            Objective_Event.NEXTLEVEL,
        ]);
    }

    
    startScene(): void {
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "level_music", loop: true, holdReference: true});
        this.subscribeToEvents();
        
        this.addLayer(Layers_enum.MENU, 10);
        this.addLayer(Layers_enum.BACK, 9);
        this.addLayer(Layers_enum.TILEMANAGER, 10);
        this.addLayer(Layers_enum.BOXONMANAGER, 11);
        this.addLayer(Layers_enum.TILEONMANAGER, 12);
        this.addLayer(Layers_enum.PAUSE, 100);
        this.addLayer(Layers_enum.PAUSEBUTTON, 101);

        this.tile_manager = new TileManager(this, this.currentMode)
        this.objectives_bar = new ObjectivesManager(this)

        Object.keys(Tiles_index).forEach(key => {
            const index = Tiles_index[key];
            this.Tiles[index] = new Set();
            this.TilesTimer[index] = new Map<String, number>();
        });
        this.pause = false;
        this.pause_box = this.add.graphic(GraphicType.RECT, Layers_enum.PAUSE, {
            position: new Vec2(640, 640),
            size: new Vec2(1280, 1280),
        });
        this.pause_box.color = Color.BLACK;
        this.pause_box.visible = false;
        this.pause_button = <Button>this.add.uiElement(UIElementType.BUTTON, Layers_enum.PAUSEBUTTON, {
            position: new Vec2(640, 640),
            text: "Abandon World?"
        })
        this.pause_button.size.set(300, 50);
        this.pause_button.borderWidth = 2;
        this.pause_button.borderColor = Color.WHITE;
        this.pause_button.backgroundColor = Color.BLACK;
        this.pause_button.onClick = () =>{
            this.sceneManager.changeToScene(MainMenu);
        }
        this.pause_button.visible = false;
        this.nextlevel = false;
        this.clicktilepos = new Vec2(-1, -1);
    }
    
    
    
    updateScene(deltaT: number): void {
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            if (event.type == Objective_Event.NEXTLEVEL){
                this.nextlevel = true
                continue;
            }
            this.currentMode = event.type;
        }
        if (Input.isKeyJustPressed('p') === true){
            this.pause = !this.pause;
            this.pause_box.visible = !this.pause_box.visible;
            this.pause_button.visible = !this.pause_button.visible;
        }
        if (this.pause){
            return;
        }
        super.updateScene(deltaT);
        this.spreadFire(deltaT);
        this.spreadWater(deltaT);
        this.spreadDisease(deltaT);
        this.growGrassFromDirt(deltaT);

        
        
        // temporarily set the tile mode
        if (Input.isKeyPressed('q')) {
            this.emitter.fireEvent(Tiles_string.DESERT);
        } else if (Input.isKeyPressed('w')) {
            this.emitter.fireEvent(Tiles_string.DIRT);
        } else if (Input.isKeyPressed('e')) {
            this.emitter.fireEvent(Tiles_string.FIRE);
        } else if (Input.isKeyPressed('r')) {
            this.emitter.fireEvent(Tiles_string.W_UP);
        } else if (Input.isKeyPressed('t')) {
            this.emitter.fireEvent(Tiles_string.ROCK);
        }

        this.tile_manager.update(this.currentMode)
        this.objectives_bar.update()

        if (Input.isMousePressed()){
            const position = Input.getGlobalMousePosition();
            if (position.y > 1088){//in the tile select, so don't do this
                return;
            }
            const tileX = Math.floor(position.x / 32) * 32 + 16;  
            const tileY = Math.floor(position.y / 32) * 32 + 16;
            const tilePos = new Vec2(tileX, tileY);
            if (tilePos == this.clicktilepos){//means not on t
                return;
            } 
        }
        if (Input.isMousePressed()) {
            const position = Input.getGlobalMousePosition();
            if (position.y > 1088){//in the tile select, so don't do this
                return;
            }
            console.log("click ",`${position.y} ${position.x}`);
            
            const tileX = Math.floor(position.x / 32) * 32 + 16;  
            const tileY = Math.floor(position.y / 32) * 32 + 16;  

            const tilePos = new Vec2(tileX, tileY);
            if (tilePos == this.clicktilepos){//means not on new tile
                return;
            } 
            const vec2ToString = this.vec2ToString(tilePos);
            const nodes = this.sceneGraph.getNodesAt(tilePos);
            console.log("click1");

        
            for (let node of nodes) {
                if (node instanceof AnimatedSprite) {
                    const animatedSprite = node as AnimatedSprite;
                    const currentAnimation = animatedSprite.animation.getcurrentAnimation();

                    if (TileMatrix[this.currentMode][currentAnimation]){
                        if (currentAnimation != Tiles_string.COMET && currentAnimation != Tiles_string.SPACE){
                            this.Tiles[Tiles_index[currentAnimation]].delete(vec2ToString);
                        }
                        else{//this means land was made from comet/space
                            this.emitter.fireEvent(Objective_Event.LANDMADE);
                        }
                        animatedSprite.animation.playIfNotAlready(this.currentMode, true);
                        this.Tiles[Tiles_index[this.currentMode]].add(vec2ToString);
                        console.log(Object.values(Objective_Event)[3])
                        this.emitter.fireEvent(Object.values(Objective_Event)[Tiles_index[this.currentMode]], {size: this.Tiles[Tiles_index[this.currentMode]].size});//If we click we change the size. We still need to fire event for regular spreading.
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.currentMode , loop: false});
                    }    

                }
                
            }
        }
        // if (Input.isMouseJustPressed()) {
        //     const position = Input.getGlobalMousePosition();
        //     if (position.y > 1088){//in the tile select, so don't do this
        //         return;
        //     }
        //     console.log("click ",`${position.y} ${position.x}`);
            
        //     const tileX = Math.floor(position.x / 32) * 32 + 16;  
        //     const tileY = Math.floor(position.y / 32) * 32 + 16;  

        //     const tilePos = new Vec2(tileX, tileY);
        //     const vec2ToString = this.vec2ToString(tilePos);
        //     const nodes = this.sceneGraph.getNodesAt(tilePos);
        //     console.log("click1");

        
        //     for (let node of nodes) {
        //         if (node instanceof AnimatedSprite) {
        //             const animatedSprite = node as AnimatedSprite;
        //             const currentAnimation = animatedSprite.animation.getcurrentAnimation();

        //             if (TileMatrix[this.currentMode][currentAnimation]){
        //                 if (currentAnimation != Tiles_string.COMET && currentAnimation != Tiles_string.SPACE){
        //                     this.Tiles[Tiles_index[currentAnimation]].delete(vec2ToString);
        //                 }
        //                 else{//this means land was made from comet/space
        //                     this.emitter.fireEvent(Objective_Event.LANDMADE);
        //                 }
        //                 animatedSprite.animation.playIfNotAlready(this.currentMode, true);
        //                 this.Tiles[Tiles_index[this.currentMode]].add(vec2ToString);
        //                 console.log(Object.values(Objective_Event)[3])
        //                 this.emitter.fireEvent(Object.values(Objective_Event)[Tiles_index[this.currentMode]], {size: this.Tiles[Tiles_index[this.currentMode]].size});//If we click we change the size. We still need to fire event for regular spreading.
        //                 this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.currentMode , loop: false});
        //             }    

        //         }
                
        //     }
        // }
        
    }

    loadScene(): void {
        this.load.audio(Tiles_string.DESERT, "Game_Resources/sounds/Desert.mp3");
        this.load.audio(Tiles_string.DIRT, "Game_Resources/sounds/Dirt.mp3");
        this.load.audio(Tiles_string.FIRE, "Game_Resources/sounds/Fire.mp3");
        this.load.audio(Tiles_string.W_UP, "Game_Resources/sounds/Water.mp3");
        this.load.audio(Tiles_string.ROCK, "Game_Resources/sounds/Rock.mp3");
    }

    unloadScene(): void {
        this.load.keepAudio(Tiles_string.FIRE);
    }
}