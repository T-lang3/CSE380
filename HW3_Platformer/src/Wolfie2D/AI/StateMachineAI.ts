import AI from "../DataTypes/Interfaces/AI";
import StateMachine from "../DataTypes/State/StateMachine";
<<<<<<< HEAD
import GameEvent from "../Events/GameEvent";
=======
>>>>>>> HW3_Platformer/main
import GameNode from "../Nodes/GameNode";

/**
 * A version of a @reference[StateMachine] that is configured to work as an AI controller for a @reference[GameNode]
 */
export default class StateMachineAI extends StateMachine implements AI {
	/**	The GameNode that uses this StateMachine for its AI */
	protected owner: GameNode;

	// @implemented
	initializeAI(owner: GameNode, config: Record<string, any>): void {}

<<<<<<< HEAD
=======
	// @implemented
	destroy(){
		// Get rid of our reference to the owner
		delete this.owner;
		this.receiver.destroy();
	}

	// @implemented
>>>>>>> HW3_Platformer/main
	activate(options: Record<string, any>): void {}
}