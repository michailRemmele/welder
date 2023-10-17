import {
  Vector2,
  Transform,
  RigidBody,
  System,
} from 'remiz';
import type {
  SystemOptions,
  GameObject,
  GameObjectObserver,
  MessageBus,
} from 'remiz';

import {
  AI,
  AIBlocker,
  Attack,
} from '../../components';
import type { CollisionEnterMessage } from '../../../types/messages';

const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const MOVE_LEFT_MSG = 'MOVE_LEFT';
const MOVE_RIGHT_MSG = 'MOVE_RIGHT';
const ADD_IMPULSE_MSG = 'ADD_IMPULSE';

export const FLY_IMPULSE = 150;

export class AISystem extends System {
  private gameObjectObserver: GameObjectObserver;
  private messageBus: MessageBus;

  constructor(options: SystemOptions) {
    super();

    this.gameObjectObserver = options.createGameObjectObserver({
      components: [Transform, AI],
    });
    this.messageBus = options.messageBus;
  }

  updateMovement(gameObject: GameObject): void {
    const ai = gameObject.getComponent(AI);

    const collisionMessages = this.messageBus.getById(
      COLLISION_ENTER_MSG,
      gameObject.id,
    ) as Array<CollisionEnterMessage> | undefined;
    const shouldTurn = collisionMessages?.some(
      (message) => !!message.gameObject2.getComponent(AIBlocker),
    );
    if (shouldTurn) {
      ai.direction *= -1;
    }

    this.messageBus.send({
      type: ai.direction === 1 ? MOVE_RIGHT_MSG : MOVE_LEFT_MSG,
      id: gameObject.id,
    });
  }

  updateAttack(gameObject: GameObject): void {
    const collisionMessages = this.messageBus.getById(
      COLLISION_ENTER_MSG,
      gameObject.id,
    ) as Array<CollisionEnterMessage> | undefined;
    const collision = collisionMessages?.find(
      (message) => !!message.gameObject2.getComponent(Attack),
    );

    if (collision) {
      const rigidBody = gameObject.getComponent(RigidBody);
      rigidBody.ghost = true;
      gameObject.removeComponent(AI);
      this.messageBus.send({
        type: ADD_IMPULSE_MSG,
        value: new Vector2(FLY_IMPULSE * Math.sign(collision.mtv1.x), -FLY_IMPULSE),
        gameObject,
        id: gameObject.id,
      });
    }
  }

  update(): void {
    this.gameObjectObserver.forEach((gameObject) => {
      this.updateMovement(gameObject);
      this.updateAttack(gameObject);
    });
  }
}

AISystem.systemName = 'AISystem';
