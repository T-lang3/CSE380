import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Battler from "../../../GameSystems/BattleSystem/Battler";
import Healthpack from "../../../GameSystems/ItemSystem/Items/Healthpack";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import NPCAction from "./NPCAction";
import Finder from "../../../GameSystems/Searching/Finder";
import BasicBattler from "../../../GameSystems/BattleSystem/BasicBattler";


export default class UseHealthpack extends NPCAction {
    
    // The targeting strategy used for this GotoAction - determines how the target is selected basically
    protected override _targetFinder: Finder<Battler>;
    // The targets or Targetable entities 
    protected override _targets: Battler[];
    // The target we are going to set the actor to target
    protected override _target: Battler | null;

    protected healthpack: Healthpack | null;

    public constructor(parent: NPCBehavior, actor: NPCActor) { 
        super(parent, actor);
        this.healthpack = null;
        this.target = null;
    }

    public onEnter(options: Record<string, any>): void {
        super.onEnter(options);
        // Find a healthpack in the actors inventory
        let healthpack = this.actor.inventory.find(item => item.constructor === Healthpack);
        if (healthpack !== null && healthpack.constructor === Healthpack) {
            this.healthpack = healthpack;
        }
    }

    public performAction(target: Battler): void {
        if (this.healthpack != null && this.healthpack.inventory !== null && this.healthpack.inventory.id === this.actor.inventory.id){
            target.health += (<Healthpack>this.healthpack).health;
            this.actor.inventory.remove(this.healthpack.id);
        }
        this.finished();
    }

}