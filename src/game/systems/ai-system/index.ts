import {
  GameObject,
  Vector2,
  Transform,
  RigidBody,
  System,
  AddImpulse,
  CollisionEnter,
  AddGameObject,
  RemoveGameObject,
} from 'remiz';
import type {
  SystemOptions,
  GameObjectObserver,
  UpdateGameObjectEvent,
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
  private gameObjectObserver: GameObjectObserver;

  constructor(options: SystemOptions) {
    super();

    this.gameObjectObserver = options.createGameObjectObserver({
      components: [Transform, AI],
    });
  }

  mount(): void {
    this.gameObjectObserver.forEach(this.handleAddGameObject);
    this.gameObjectObserver.addEventListener(AddGameObject, this.handleAddGameObject);
    this.gameObjectObserver.addEventListener(RemoveGameObject, this.handleRemoveGameObject);
  }

  unmount(): void {
    this.gameObjectObserver.forEach(this.handleRemoveGameObject);
    this.gameObjectObserver.removeEventListener(AddGameObject, this.handleAddGameObject);
    this.gameObjectObserver.removeEventListener(RemoveGameObject, this.handleRemoveGameObject);
  }

  private handleAddGameObject = (value: UpdateGameObjectEvent | GameObject): void => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;
    gameObject.addEventListener(CollisionEnter, this.handleCollisionEnter);
  };

  private handleRemoveGameObject = (value: UpdateGameObjectEvent | GameObject): void => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;
    gameObject.removeEventListener(CollisionEnter, this.handleCollisionEnter);
  };

  private handleCollisionEnter = (event: CollisionEnterEvent): void => {
    const { gameObject, target, mtv } = event;

    const ai = target.getComponent(AI);

    const shouldTurn = !!gameObject.getComponent(AIBlocker);
    if (shouldTurn) {
      ai.direction *= -1;
    }

    const hasAttacked = !!gameObject.getComponent(Attack);
    if (hasAttacked) {
      const rigidBody = target.getComponent(RigidBody);
      rigidBody.ghost = true;
      target.removeComponent(AI);
      target.emit(AddImpulse, {
        value: new Vector2(FLY_IMPULSE * Math.sign(mtv.x), -FLY_IMPULSE),
      });
    }
  };

  updateMovement(gameObject: GameObject): void {
    const ai = gameObject.getComponent(AI);
    gameObject.emit(ai.direction === 1 ? EventType.MoveRight : EventType.MoveLeft);
  }

  update(): void {
    this.gameObjectObserver.forEach((gameObject) => {
      this.updateMovement(gameObject);
    });
  }
}

AISystem.systemName = 'AISystem';
