import CanvasNode from "./CanvasNode";
import Color from "../Utils/Color";

/**
 * The representation of a game object that doesn't rely on any resources to render - it is drawn to the screen by the canvas
 */
export default abstract class Graphic extends CanvasNode {
    /** The color of the Graphic */
    color: Color;

    constructor(){
        super();
        this.color = Color.RED;
    }

<<<<<<< HEAD
=======
    get alpha(): number {
		return this.color.a;
	}

	set alpha(a: number) {
		this.color.a = a;
	}

>>>>>>> HW3_Platformer/main
    // @deprecated
    /**
     * Sets the color of the Graphic. DEPRECATED
     * @param color The new color of the Graphic.
     */
    setColor(color: Color){
        this.color = color;
    }
<<<<<<< HEAD
=======

    set colorR(r: number){
        this.color.r = r;
    }

    get colorR(): number {
        return this.color.r;
    }

    set colorG(g: number){
        this.color.g = g;
    }

    get colorG(): number {
        return this.color.g;
    }

    set colorB(b: number){
        this.color.b = b;
    }

    get colorB(): number {
        return this.color.b;
    }
>>>>>>> HW3_Platformer/main
}