import Graphic from "../Graphic";
import Vec2 from "../../DataTypes/Vec2";

/** A basic point to be drawn on the screen. */
export default class Point extends Graphic {

<<<<<<< HEAD
    constructor(position: Vec2){
=======
    constructor(position: Vec2) {
        // Are we making this a circle?
>>>>>>> HW3_Platformer/main
        super();
        this.position = position;
        this.size.set(5, 5);
    }
}