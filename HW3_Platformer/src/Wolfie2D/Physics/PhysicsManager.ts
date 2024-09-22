<<<<<<< HEAD
import GameNode from "../Nodes/GameNode";
=======
>>>>>>> HW3_Platformer/main
import Updateable from "../DataTypes/Interfaces/Updateable";
import Tilemap from "../Nodes/Tilemap";
import Receiver from "../Events/Receiver";
import Emitter from "../Events/Emitter";
import Map from "../DataTypes/Map";
<<<<<<< HEAD
=======
import Physical from "../DataTypes/Interfaces/Physical";
>>>>>>> HW3_Platformer/main

/**
 * An abstract physics manager.
 * This class exposes functions for subclasses to implement that should allow for a working physics system to be created.
 */
export default abstract class PhysicsManager implements Updateable {
	/** The event receiver for the physics system */
	protected receiver: Receiver;
	/** The event emitter for the physics system */
	protected emitter: Emitter;

	/** Maps layer names to numbers */
<<<<<<< HEAD
	protected layerMap: Map<number>;

	/** Maps layer numbers to names */
	protected layerNames: Array<string>;
=======
	protected groupMap: Map<number>;

	/** Maps layer numbers to names */
	protected groupNames: Array<string>;

	/** The default group name */
	protected static readonly DEFAULT_GROUP: string = "Default";
>>>>>>> HW3_Platformer/main

	constructor(){
		this.receiver = new Receiver();
		this.emitter = new Emitter();

		// The creation and implementation of layers is deferred to the subclass
<<<<<<< HEAD
		this.layerMap = new Map();
		this.layerNames = new Array();
=======
		this.groupMap = new Map();
		this.groupNames = new Array();
	}

	destroy(): void {
		this.receiver.destroy();
>>>>>>> HW3_Platformer/main
	}

	/**
	 * Registers a gamenode with this physics manager
	 * @param object The object to register
	 */
<<<<<<< HEAD
	abstract registerObject(object: GameNode): void;
=======
	abstract registerObject(object: Physical): void;


	/**
	 * Removes references to this object from the physics managerr
	 * @param object The object to deregister
	 */
	abstract deregisterObject(object: Physical): void;
>>>>>>> HW3_Platformer/main

	/**
	 * Registers a tilemap with this physics manager
	 * @param tilemap The tilemap to register
	 */
	abstract registerTilemap(tilemap: Tilemap): void;

<<<<<<< HEAD
=======
	/**
	 * Removes references to this tilemap from the physics managerr
	 * @param tilemap The object to deregister
	 */
	abstract deregisterTilemap(tilemap: Tilemap): void;

>>>>>>> HW3_Platformer/main
	abstract update(deltaT: number): void;

	/**
	 * Sets the physics layer of the GameNode
	 * @param node The GameNode
<<<<<<< HEAD
	 * @param layer The layer that the GameNode should be on
	 */
	setLayer(node: GameNode, layer: string): void {
		node.physicsLayer = this.layerMap.get(layer);
=======
	 * @param group The group that the GameNode should be on
	 */
	setGroup(node: Physical, group: string): void {
		node.group = this.groupMap.get(group);
	}

	/**
	 * Retrieves the layer number associated with the provided name
	 * @param layer The name of the layer
	 * @returns The layer number, or 0 if there is not a layer with that name registered
	 */
	getGroupNumber(group: string): number {
		if(this.groupMap.has(group)){
			return this.groupMap.get(group);
		} else{
			return 0;
		}
	}

	/**
	 * Gets all group names associated with the number provided
	 * @param groups A mask of groups
	 * @returns All groups contained in the mask
	 */
	getGroupNames(groups: number): Array<string> {
		if(groups === -1){
			return [PhysicsManager.DEFAULT_GROUP];
		} else {
			let g = 1;
			let names = [];

			for(let i = 0; i < 32; i++){
				if(g & groups){
					// This group is in the groups number
					names.push(this.groupNames[i]);
				}

				// Shift the bit over
				g = g << 1;
			}
		}
>>>>>>> HW3_Platformer/main
	}
}