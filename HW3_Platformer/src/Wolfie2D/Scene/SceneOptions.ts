import ArrayUtils from "../Utils/ArrayUtils";

// @ignorePage

/**
 * The options to give a @reference[Scene] for initialization
 */
export default class SceneOptions {
    physics: {
<<<<<<< HEAD
        numPhysicsLayers: number,
        physicsLayerNames: Array<string>,
        physicsLayerCollisions: Array<Array<number>>;
=======
        groups: Array<string>,
        collisions: Array<Array<number>>;
>>>>>>> HW3_Platformer/main
    }

    static parse(options: Record<string, any>): SceneOptions{
        let sOpt = new SceneOptions();

<<<<<<< HEAD
        sOpt.physics = {
            numPhysicsLayers: 10,
            physicsLayerNames: null,
            physicsLayerCollisions: ArrayUtils.ones2d(10, 10)
        };

        if(options.physics){
            if(options.physics.numPhysicsLayers)        sOpt.physics.numPhysicsLayers = options.physics.numPhysicsLayers;
            if(options.physics.physicsLayerNames)       sOpt.physics.physicsLayerNames = options.physics.physicsLayerNames;
            if(options.physics.physicsLayerCollisions)  sOpt.physics.physicsLayerCollisions = options.physics.physicsLayerCollisions;
=======
        if(options.physics === undefined){
            sOpt.physics = {groups: undefined, collisions: undefined};
        } else {
            sOpt.physics = options.physics;
>>>>>>> HW3_Platformer/main
        }

        return sOpt;
    }
}