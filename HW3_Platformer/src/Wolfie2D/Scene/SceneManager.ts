import Scene from "./Scene";
import ResourceManager from "../ResourceManager/ResourceManager";
import Viewport from "../SceneGraph/Viewport";
import RenderingManager from "../Rendering/RenderingManager";
<<<<<<< HEAD
=======
import MemoryUtils from "../Utils/MemoryUtils";
>>>>>>> HW3_Platformer/main

/**
 * The SceneManager acts as an interface to create Scenes, and handles the lifecycle methods of Scenes.
 * It gives Scenes access to information they need from the @reference[Game] class while keeping a layer of separation.
 */
export default class SceneManager {
	/** The current Scene of the game */
	protected currentScene: Scene;

	/** The Viewport of the game */
	protected viewport: Viewport;

	/** A reference to the ResourceManager */
	protected resourceManager: ResourceManager;

	/** A counter to keep track of game ids */
	protected idCounter: number;

	/** The RenderingManager of the game */
	protected renderingManager: RenderingManager;

<<<<<<< HEAD
=======
	/** For consistency, only change scenes at the beginning of the update cycle */
	protected pendingScene: Scene;
	protected pendingSceneInit: Record<string, any>;

>>>>>>> HW3_Platformer/main
	/**
	 * Creates a new SceneManager
	 * @param viewport The Viewport of the game
	 * @param game The Game instance
	 * @param renderingManager The RenderingManager of the game
	 */
	constructor(viewport: Viewport, renderingManager: RenderingManager){
		this.resourceManager = ResourceManager.getInstance();
		this.viewport = viewport;
		this.renderingManager = renderingManager;
		this.idCounter = 0;
<<<<<<< HEAD
=======
		this.pendingScene = null;
>>>>>>> HW3_Platformer/main
	}

	/**
	 * Add a scene as the main scene.
	 * Use this method if you've created a subclass of Scene, and you want to add it as the main Scene.
	 * @param constr The constructor of the scene to add
	 * @param init An object to pass to the init function of the new scene
	 */
<<<<<<< HEAD
	public addScene<T extends Scene>(constr: new (...args: any) => T, init?: Record<string, any>, options?: Record<string, any>): void {
		let scene = new constr(this.viewport, this, this.renderingManager, options);
		this.currentScene = scene;

		scene.initScene(init);

		// Enqueue all scene asset loads
		scene.loadScene();
=======
	public changeToScene<T extends Scene>(constr: new (...args: any) => T, init?: Record<string, any>, options?: Record<string, any>): void {
		console.log("Creating the new scene - change is pending until next update");
		this.pendingScene = new constr(this.viewport, this, this.renderingManager, options);
		this.pendingSceneInit = init;
	}

	protected doSceneChange(){
		console.log("Performing scene change");
		this.viewport.setCenter(this.viewport.getHalfSize().x, this.viewport.getHalfSize().y);
		
		if(this.currentScene){
			console.log("Unloading old scene")
			this.currentScene.unloadScene();

			console.log("Destroying old scene");
			this.currentScene.destroy();
		}

		console.log("Unloading old resources...");
		this.resourceManager.unloadAllResources();

		// Make the pending scene the current one
		this.currentScene = this.pendingScene;

		// Make the pending scene null
		this.pendingScene = null;

		// Init the scene
		this.currentScene.initScene(this.pendingSceneInit);

		// Enqueue all scene asset loads
		this.currentScene.loadScene();
>>>>>>> HW3_Platformer/main

		// Load all assets
		console.log("Starting Scene Load");
		this.resourceManager.loadResourcesFromQueue(() => {
			console.log("Starting Scene");
<<<<<<< HEAD
			scene.startScene();
			scene.setRunning(true);
		});

		this.renderingManager.setScene(scene);
	}

	/**
	 * Change from the current scene to this new scene.
	 * Use this method if you've created a subclass of Scene, and you want to add it as the main Scene.
	 * @param constr The constructor of the scene to change to
	 * @param init An object to pass to the init function of the new scene
	 */
	public changeScene<T extends Scene>(constr: new (...args: any) => T, init?: Record<string, any>, options?: Record<string, any>): void {
		this.viewport.setCenter(this.viewport.getHalfSize().x, this.viewport.getHalfSize().y);

		this.addScene(constr, init, options);
	}

=======
			this.currentScene.startScene();
			this.currentScene.setRunning(true);
		});

		this.renderingManager.setScene(this.currentScene);
	}
	
>>>>>>> HW3_Platformer/main
	/**
	 * Generates a unique ID
	 * @returns A new ID
	 */
	public generateId(): number {
		return this.idCounter++;
	}

	/**
	 * Renders the current Scene
	 */
	public render(): void {
<<<<<<< HEAD
		this.currentScene.render();
=======
		if(this.currentScene){
			this.currentScene.render();
		}
>>>>>>> HW3_Platformer/main
	}

	/**
	 * Updates the current Scene
	 * @param deltaT The timestep of the Scene
	 */
	public update(deltaT: number){
<<<<<<< HEAD
		if(this.currentScene.isRunning()){
=======
		if(this.pendingScene !== null){
			this.doSceneChange();
		}

		if(this.currentScene && this.currentScene.isRunning()){
>>>>>>> HW3_Platformer/main
			this.currentScene.update(deltaT);
		}
	}
}