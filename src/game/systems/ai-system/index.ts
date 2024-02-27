import {
  Scene,
  Actor,
  ActorCollection,
  Vector2,
  Transform,
  RigidBody,
  System,
  AddImpulse,
  CollisionEnter,
} from 'remiz';
import type {
  SystemOptions,
  CollisionEnterEvent,
} from 'remiz';

import {
  AI,
  AIBlocker,
  Attack,
} from '../../components';
import * as EventType from '../../events';

export const FLY_IMPULSE = 150;

export class AISystem extends System {
  private scene: Scene;
  private actorCollection: ActorCollection;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;
    this.actorCollection = new ActorCollection(options.scene, {
      components: [Transform, AI],
    });
  }

  mount(): void {
    this.scene.addEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  unmount(): void {
    this.scene.removeEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  private handleCollisionEnter = (event: CollisionEnterEvent): void => {
    const { actor, target, mtv } = event;

    const ai = target.getComponent(AI);
    if (ai === undefined) {
      return;
    }

    const shouldTurn = !!actor.getComponent(AIBlocker);
    if (shouldTurn) {
      ai.direction *= -1;
    }

    const hasAttacked = !!actor.getComponent(Attack);
    if (hasAttacked) {
      const rigidBody = target.getComponent(RigidBody);
      rigidBody.ghost = true;
      target.removeComponent(AI);
      target.emit(AddImpulse, {
        value: new Vector2(FLY_IMPULSE * Math.sign(mtv.x), -FLY_IMPULSE),
      });
    }
  };

  updateMovement(actor: Actor): void {
    const ai = actor.getComponent(AI);
    actor.emit(ai.direction === 1 ? EventType.MoveRight : EventType.MoveLeft);
  }

  update(): void {
    this.actorCollection.forEach((actor) => {
      this.updateMovement(actor);
    });
  }
}

AISystem.systemName = 'AISystem';
