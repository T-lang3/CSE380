import Viewport from "./Viewport";
import CanvasNode from "../Nodes/CanvasNode";
import Map from "../DataTypes/Map";
import Vec2 from "../DataTypes/Vec2";
import Scene from "../Scene/Scene";
import AABB from "../DataTypes/Shapes/AABB";

/**
 * An abstract interface of a SceneGraph.
 * Exposes methods for use by other code, but leaves the implementation up to the subclasses.
 * The SceneGraph manages the positions of all GameNodes, and can easily prune a visible set for rendering.
 */
export default abstract class SceneGraph {
	/**	A reference to the viewport */
	protected viewport: Viewport;
	/**	A map of CanvasNodes in this SceneGraph */
<<<<<<< HEAD
	protected nodeMap: Map<CanvasNode>;
=======
	protected nodeMap: Array<CanvasNode>;
>>>>>>> HW3_Platformer/main
	/** A counter of IDs for nodes in this SceneGraph */
	protected idCounter: number;
	/** A reference to the Scene this SceneGraph belongs to */
	protected scene: Scene;

	/**
	 * Creates a new SceneGraph
	 * @param viewport The viewport
	 * @param scene The Scene this SceneGraph belongs to
	 */
    constructor(viewport: Viewport, scene: Scene){
		this.viewport = viewport;
		this.scene = scene;
<<<<<<< HEAD
		this.nodeMap = new Map<CanvasNode>();
=======
		this.nodeMap = new Array();
>>>>>>> HW3_Platformer/main
		this.idCounter = 0;
    }

	/**
	 * Add a node to the SceneGraph
	 * @param node The CanvasNode to add to the SceneGraph
	 * @returns The SceneGraph ID of this newly added CanvasNode
	 */
    addNode(node: CanvasNode): number {
<<<<<<< HEAD
		this.nodeMap.add(this.idCounter.toString(), node);
		this.addNodeSpecific(node, this.idCounter.toString());
=======
		this.nodeMap[node.id] = node;
		this.addNodeSpecific(node, this.idCounter);
>>>>>>> HW3_Platformer/main
		this.idCounter += 1;
		return this.idCounter - 1;
	};

	/**
	 * An overridable method to add a CanvasNode to the specific data structure of the SceneGraph
	 * @param node The node to add to the data structure
	 * @param id The id of the CanvasNode
	 */
<<<<<<< HEAD
	protected abstract addNodeSpecific(node: CanvasNode, id: string): void;
=======
	protected abstract addNodeSpecific(node: CanvasNode, id: number): void;
>>>>>>> HW3_Platformer/main

	/**
	 * Removes a node from the SceneGraph
	 * @param node The node to remove
	 */
    removeNode(node: CanvasNode): void {
		// Find and remove node in O(n)
<<<<<<< HEAD
		// TODO: Can this be better?
		let id = this.nodeMap.keys().filter((key: string) => this.nodeMap.get(key) === node)[0];
		if(id !== undefined){
			this.nodeMap.set(id, undefined);
			this.removeNodeSpecific(node, id);
		}
=======
		this.nodeMap[node.id] = undefined;
		this.removeNodeSpecific(node, node.id);
>>>>>>> HW3_Platformer/main
	};

	/**
	 * The specific implementation of removing a node
	 * @param node The node to remove
	 * @param id The id of the node to remove
	 */
<<<<<<< HEAD
	protected abstract removeNodeSpecific(node: CanvasNode, id: string): void;
=======
	protected abstract removeNodeSpecific(node: CanvasNode, id: number): void;
>>>>>>> HW3_Platformer/main

	/**
	 * Get a specific node using its id
	 * @param id The id of the CanvasNode to retrieve
	 * @returns The node with this ID
	 */
<<<<<<< HEAD
	getNode(id: string): CanvasNode {
		return this.nodeMap.get(id);
=======
	getNode(id: number): CanvasNode {
		return this.nodeMap[id];
>>>>>>> HW3_Platformer/main
	}

	/**
	 * Returns the nodes at specific coordinates
	 * @param vecOrX The x-coordinate of the position, or the coordinates in a Vec2
	 * @param y The y-coordinate of the position
	 * @returns An array of nodes found at the position provided
	 */
    getNodesAt(vecOrX: Vec2 | number, y: number = null): Array<CanvasNode> {
		if(vecOrX instanceof Vec2){
			return this.getNodesAtCoords(vecOrX.x, vecOrX.y);
		} else {
			return this.getNodesAtCoords(vecOrX, y);
		}
	}

	/**
	 * Returns the nodes that overlap a specific boundary
	 * @param boundary The region to check
	 * @returns An array of nodes found overlapping the provided boundary
	 */
	abstract getNodesInRegion(boundary: AABB): Array<CanvasNode>;
	
	/**
	 * Returns all nodes in the SceneGraph
	 * @returns An Array containing all nodes in the SceneGraph
	 */
	getAllNodes(): Array<CanvasNode> {
		let arr = new Array<CanvasNode>();
<<<<<<< HEAD
		this.nodeMap.forEach(key => arr.push(this.nodeMap.get(key)));
=======
		for(let i = 0; i < this.nodeMap.length; i++){
			if(this.nodeMap[i] !== undefined){
				arr.push(this.nodeMap[i]);
			}
		}
>>>>>>> HW3_Platformer/main
		return arr;
	}

	/**
	 * The specific implementation of getting a node at certain coordinates
	 * @param x The x-coordinates of the node
	 * @param y The y-coordinates of the node
	 */
    protected abstract getNodesAtCoords(x: number, y: number): Array<CanvasNode>;

	abstract update(deltaT: number): void;
	
	abstract render(ctx: CanvasRenderingContext2D): void;

	/**
	 * Gets the visible set of CanvasNodes based on the @reference[Viewport]
	 * @returns An array containing all visible nodes in the SceneGraph
	 */
    abstract getVisibleSet(): Array<CanvasNode>;
}