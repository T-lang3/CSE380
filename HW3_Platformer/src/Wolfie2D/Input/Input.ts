import Receiver from "../Events/Receiver";
import Map from "../DataTypes/Map";
import Vec2 from "../DataTypes/Vec2";
import EventQueue from "../Events/EventQueue";
import Viewport from "../SceneGraph/Viewport";
import GameEvent from "../Events/GameEvent";
import { GameEventType } from "../Events/GameEventType";

/**
 * Receives input events from the @reference[EventQueue] and allows for easy access of information about input by other systems
 */
export default class Input {
	private static mousePressed: boolean;
	private static mouseJustPressed: boolean;
<<<<<<< HEAD
=======
	private static mouseButtonPressed: number;
>>>>>>> HW3_Platformer/main

	private static keyJustPressed: Map<boolean>;
	private static keyPressed: Map<boolean>;

	private static mousePosition: Vec2;
	private static mousePressPosition: Vec2;

	private static scrollDirection: number;
	private static justScrolled: boolean;

	private static eventQueue: EventQueue;
	private static receiver: Receiver;
	private static viewport: Viewport;

	private static keyMap: Map<Array<string>>;

<<<<<<< HEAD
=======
	private static keysDisabled: boolean;
	private static mouseDisabled: boolean;

>>>>>>> HW3_Platformer/main
	/**
	 * Initializes the Input object
	 * @param viewport A reference to the viewport of the game
	 */
<<<<<<< HEAD
	static initialize(viewport: Viewport, keyMap: Array<Record<string, any>>){
=======
	static initialize(viewport: Viewport, keyMap: Array<Record<string, any>>) {
>>>>>>> HW3_Platformer/main
		Input.viewport = viewport;
		Input.mousePressed = false;
		Input.mouseJustPressed = false;
		Input.receiver = new Receiver();
		Input.keyJustPressed = new Map<boolean>();
		Input.keyPressed = new Map<boolean>();
		Input.mousePosition = new Vec2(0, 0);
		Input.mousePressPosition = new Vec2(0, 0);
		Input.scrollDirection = 0;
		Input.justScrolled = false;
<<<<<<< HEAD
=======
		Input.keysDisabled = false;
		Input.mouseDisabled = false;
>>>>>>> HW3_Platformer/main

		// Initialize the keymap
		Input.keyMap = new Map();

		// Add all keys to the keymap
<<<<<<< HEAD
		for(let entry in keyMap){
=======
		for (let entry in keyMap) {
>>>>>>> HW3_Platformer/main
			let name = keyMap[entry].name;
			let keys = keyMap[entry].keys;
			Input.keyMap.add(name, keys);
		}

		Input.eventQueue = EventQueue.getInstance();
		// Subscribe to all input events
		Input.eventQueue.subscribe(Input.receiver, [GameEventType.MOUSE_DOWN, GameEventType.MOUSE_UP, GameEventType.MOUSE_MOVE,
<<<<<<< HEAD
			 GameEventType.KEY_DOWN, GameEventType.KEY_UP, GameEventType.CANVAS_BLUR, GameEventType.WHEEL_UP, GameEventType.WHEEL_DOWN]);
=======
		GameEventType.KEY_DOWN, GameEventType.KEY_UP, GameEventType.CANVAS_BLUR, GameEventType.WHEEL_UP, GameEventType.WHEEL_DOWN]);
>>>>>>> HW3_Platformer/main
	}

	static update(deltaT: number): void {
		// Reset the justPressed values to false
		Input.mouseJustPressed = false;
		Input.keyJustPressed.forEach((key: string) => Input.keyJustPressed.set(key, false));
		Input.justScrolled = false;
		Input.scrollDirection = 0;

<<<<<<< HEAD
		while(Input.receiver.hasNextEvent()){			
			let event = Input.receiver.getNextEvent();
			
			// Handle each event type
			if(event.type === GameEventType.MOUSE_DOWN){
				Input.mouseJustPressed = true;
				Input.mousePressed = true;
				Input.mousePressPosition = event.data.get("position");	
			}

			if(event.type === GameEventType.MOUSE_UP){
				Input.mousePressed = false;
			}

			if(event.type === GameEventType.MOUSE_MOVE){
				Input.mousePosition = event.data.get("position");
			}

			if(event.type === GameEventType.KEY_DOWN){
				let key = event.data.get("key");
				// Handle space bar
				if(key === " "){
					key = "space";
				}
				if(!Input.keyPressed.get(key)){
=======
		while (Input.receiver.hasNextEvent()) {
			let event = Input.receiver.getNextEvent();

			// Handle each event type
			if (event.type === GameEventType.MOUSE_DOWN) {
				Input.mouseJustPressed = true;
				Input.mousePressed = true;
				Input.mousePressPosition = event.data.get("position");
				Input.mouseButtonPressed = event.data.get("button");
			}

			if (event.type === GameEventType.MOUSE_UP) {
				Input.mousePressed = false;
			}

			if (event.type === GameEventType.MOUSE_MOVE) {
				Input.mousePosition = event.data.get("position");
			}

			if (event.type === GameEventType.KEY_DOWN) {
				let key = event.data.get("key");
				// Handle space bar
				if (key === " ") {
					key = "space";
				}
				if (!Input.keyPressed.get(key)) {
>>>>>>> HW3_Platformer/main
					Input.keyJustPressed.set(key, true);
					Input.keyPressed.set(key, true);
				}
			}

<<<<<<< HEAD
			if(event.type === GameEventType.KEY_UP){
				let key = event.data.get("key");
				// Handle space bar
				if(key === " "){
=======
			if (event.type === GameEventType.KEY_UP) {
				let key = event.data.get("key");
				// Handle space bar
				if (key === " ") {
>>>>>>> HW3_Platformer/main
					key = "space";
				}
				Input.keyPressed.set(key, false);
			}

<<<<<<< HEAD
			if(event.type === GameEventType.CANVAS_BLUR){
				Input.clearKeyPresses()
			}

			if(event.type === GameEventType.WHEEL_UP){
				Input.scrollDirection = -1;
				Input.justScrolled = true;
			} else if(event.type === GameEventType.WHEEL_DOWN){
=======
			if (event.type === GameEventType.CANVAS_BLUR) {
				Input.clearKeyPresses()
			}

			if (event.type === GameEventType.WHEEL_UP) {
				Input.scrollDirection = -1;
				Input.justScrolled = true;
			} else if (event.type === GameEventType.WHEEL_DOWN) {
>>>>>>> HW3_Platformer/main
				Input.scrollDirection = 1;
				Input.justScrolled = true;
			}
		}
	}

	private static clearKeyPresses(): void {
		Input.keyJustPressed.forEach((key: string) => Input.keyJustPressed.set(key, false));
		Input.keyPressed.forEach((key: string) => Input.keyPressed.set(key, false));
	}

	/**
	 * Returns whether or not a key was newly pressed Input frame.
	 * If the key is still pressed from last frame and wasn't re-pressed, Input will return false.
	 * @param key The key
	 * @returns True if the key was just pressed, false otherwise
	 */
	static isKeyJustPressed(key: string): boolean {
<<<<<<< HEAD
		if(Input.keyJustPressed.has(key)){
=======
		if (Input.keysDisabled) return false;

		if (Input.keyJustPressed.has(key)) {
>>>>>>> HW3_Platformer/main
			return Input.keyJustPressed.get(key)
		} else {
			return false;
		}
	}

	/**
	 * Returns an array of all of the keys that are newly pressed Input frame.
	 * If a key is still pressed from last frame and wasn't re-pressed, it will not be in Input list.
	 * @returns An array of all of the newly pressed keys.
	 */
	static getKeysJustPressed(): Array<string> {
<<<<<<< HEAD
		let keys = Array<string>();
		Input.keyJustPressed.forEach(key => {
			if(Input.keyJustPressed.get(key)){
=======
		if (Input.keysDisabled) return [];

		let keys = Array<string>();
		Input.keyJustPressed.forEach(key => {
			if (Input.keyJustPressed.get(key)) {
>>>>>>> HW3_Platformer/main
				keys.push(key);
			}
		});
		return keys;
	}

	/**
	 * Returns whether or not a key is being pressed.
	 * @param key The key
	 * @returns True if the key is currently pressed, false otherwise
	 */
	static isKeyPressed(key: string): boolean {
<<<<<<< HEAD
		if(Input.keyPressed.has(key)){
=======
		if (Input.keysDisabled) return false;

		if (Input.keyPressed.has(key)) {
>>>>>>> HW3_Platformer/main
			return Input.keyPressed.get(key)
		} else {
			return false;
		}
	}

	/**
	 * Changes the binding of an input name to keys
	 * @param inputName The name of the input
	 * @param keys The corresponding keys
	 */
	static changeKeyBinding(inputName: string, keys: Array<string>): void {
		Input.keyMap.set(inputName, keys);
	}

	/**
	 * Clears all key bindings
	 */
	static clearAllKeyBindings(): void {
		Input.keyMap.clear();
	}

	/**
	 * Returns whether or not an input was just pressed this frame
	 * @param inputName The name of the input
	 * @returns True if the input was just pressed, false otherwise
	 */
	static isJustPressed(inputName: string): boolean {
<<<<<<< HEAD
		if(Input.keyMap.has(inputName)){
			const keys = Input.keyMap.get(inputName);
			let justPressed = false;

			for(let key of keys){
=======
		if (Input.keysDisabled) return false;

		if (Input.keyMap.has(inputName)) {
			const keys = Input.keyMap.get(inputName);
			let justPressed = false;

			for (let key of keys) {
>>>>>>> HW3_Platformer/main
				justPressed = justPressed || Input.isKeyJustPressed(key);
			}

			return justPressed;
		} else {
			return false;
<<<<<<< HEAD
		}	
=======
		}
>>>>>>> HW3_Platformer/main
	}

	/**
	 * Returns whether or not an input is currently pressed
	 * @param inputName The name of the input
	 * @returns True if the input is pressed, false otherwise
	 */
	static isPressed(inputName: string): boolean {
<<<<<<< HEAD
		if(Input.keyMap.has(inputName)){
			const keys = Input.keyMap.get(inputName);
			let pressed = false;

			for(let key of keys){
=======
		if (Input.keysDisabled) return false;

		if (Input.keyMap.has(inputName)) {
			const keys = Input.keyMap.get(inputName);
			let pressed = false;

			for (let key of keys) {
>>>>>>> HW3_Platformer/main
				pressed = pressed || Input.isKeyPressed(key);
			}

			return pressed;
		} else {
			return false;
		}
	}
<<<<<<< HEAD

	/**
	 * Returns whether or not the mouse was newly pressed Input frame
	 * @returns True if the mouse was just pressed, false otherwise
	 */
	static isMouseJustPressed(): boolean {
		return Input.mouseJustPressed;
=======
	/**
	 * 
	 * Returns whether or not the mouse was newly pressed Input frame.
	 * @param mouseButton Optionally specify which mouse click you want to know was pressed. 
	 * 0 for left click, 1 for middle click, 2 for right click.
	 * @returns True if the mouse was just pressed, false otherwise
	 */
	static isMouseJustPressed(mouseButton?: number): boolean {
		if (mouseButton) {
			return Input.mouseJustPressed && !Input.mouseDisabled && mouseButton == this.mouseButtonPressed;
		}
		return Input.mouseJustPressed && !Input.mouseDisabled;
>>>>>>> HW3_Platformer/main
	}

	/**
	 * Returns whether or not the mouse is currently pressed
<<<<<<< HEAD
	 * @returns True if the mouse is currently pressed, false otherwise
	 */
	static isMousePressed(): boolean {
		return Input.mousePressed;
=======
	 * @param mouseButton Optionally specify which mouse click you want to know was pressed. 
	 * 0 for left click, 1 for middle click, 2 for right click.
	 * @returns True if the mouse is currently pressed, false otherwise
	 */
	static isMousePressed(mouseButton?: number): boolean {
		if (mouseButton) {
			return Input.mousePressed && !Input.mouseDisabled && mouseButton == this.mouseButtonPressed;
		}
		return Input.mousePressed && !Input.mouseDisabled;
>>>>>>> HW3_Platformer/main
	}

	/**
	 * Returns whether the user scrolled or not
	 * @returns True if the user just scrolled Input frame, false otherwise
	 */
	static didJustScroll(): boolean {
<<<<<<< HEAD
		return Input.justScrolled;
=======
		return Input.justScrolled && !Input.mouseDisabled;
>>>>>>> HW3_Platformer/main
	}

	/**
	 * Gets the direction of the scroll
	 * @returns -1 if the user scrolled up, 1 if they scrolled down
	 */
	static getScrollDirection(): number {
		return Input.scrollDirection;
	}

	/**
	 * Gets the position of the player's mouse
	 * @returns The mouse position stored as a Vec2
	 */
	static getMousePosition(): Vec2 {
<<<<<<< HEAD
		return Input.mousePosition;
=======
		return Input.mousePosition.scaled(1 / this.viewport.getZoomLevel());
>>>>>>> HW3_Platformer/main
	}

	/**
	 * Gets the position of the player's mouse in the game world,
	 * taking into consideration the scrolling of the viewport
	 * @returns The mouse position stored as a Vec2
	 */
	static getGlobalMousePosition(): Vec2 {
<<<<<<< HEAD
		return Input.mousePosition.clone().add(Input.viewport.getOrigin());
=======
		return Input.mousePosition.clone().scale(1 / this.viewport.getZoomLevel()).add(Input.viewport.getOrigin());
>>>>>>> HW3_Platformer/main
	}

	/**
	 * Gets the position of the last mouse press
	 * @returns The mouse position stored as a Vec2
	 */
	static getMousePressPosition(): Vec2 {
		return Input.mousePressPosition;
	}

	/**
	 * Gets the position of the last mouse press in the game world,
	 * taking into consideration the scrolling of the viewport
	 * @returns The mouse position stored as a Vec2
	 */
	static getGlobalMousePressPosition(): Vec2 {
		return Input.mousePressPosition.clone().add(Input.viewport.getOrigin());
	}
<<<<<<< HEAD
=======

	/**
	 * Disables all keypress and mouse click inputs
	 */
	static disableInput(): void {
		Input.keysDisabled = true;
		Input.mouseDisabled = true;
	}

	/**
	 * Enables all keypress and mouse click inputs
	 */
	static enableInput(): void {
		Input.keysDisabled = false;
		Input.mouseDisabled = false;
	}
>>>>>>> HW3_Platformer/main
}