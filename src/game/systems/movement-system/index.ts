import {
  GameObject,
  Vector2,
  Transform,
  RigidBody,
  System,
  CollisionEnter,
  AddImpulse,
  AddGameObject,
  RemoveGameObject,
} from 'remiz';
import type {
  SystemOptions,
  UpdateOptions,
  GameObjectObserver,
  UpdateGameObjectEvent,
  GameObjectEvent,
  CollisionEnterEvent,
} from 'remiz';

import {
  Movement,
  ViewDirection,
} from '../../components';
import * as EventType from '../../events';

const JUMP_IMPULSE = -215;

export class MovementSystem extends System {
  private gameObjectObserver: GameObjectObserver;

  constructor(options: SystemOptions) {
    super();

    this.gameObjectObserver = options.createGameObjectObserver({
      components: [
        Transform,
        Movement,
        ViewDirection,
      ],
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
    gameObject.addEventListener(EventType.MoveLeft, this.handleMoveLeft);
    gameObject.addEventListener(EventType.MoveRight, this.handleMoveRight);
    gameObject.addEventListener(EventType.MoveJump, this.handleJump);
  };

  private handleRemoveGameObject = (value: UpdateGameObjectEvent | GameObject): void => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;
    gameObject.removeEventListener(CollisionEnter, this.handleCollisionEnter);
    gameObject.removeEventListener(EventType.MoveLeft, this.handleMoveLeft);
    gameObject.removeEventListener(EventType.MoveRight, this.handleMoveRight);
    gameObject.removeEventListener(EventType.MoveJump, this.handleJump);
  };

  private handleMoveLeft = (event: GameObjectEvent): void => {
    const movement = event.target.getComponent(Movement);
    movement.direction = -1;
    movement.isMoving = true;
  };

  private handleMoveRight = (event: GameObjectEvent): void => {
    const movement = event.target.getComponent(Movement);
    movement.direction = 1;
    movement.isMoving = true;
  };

  private handleJump = (event: GameObjectEvent): void => {
    const movement = event.target.getComponent(Movement);
    if (movement.isJumping) {
      return;
    }

    event.target.emit(AddImpulse, {
      value: new Vector2(0, JUMP_IMPULSE),
    });
    movement.isJumping = true;
  };

  private handleCollisionEnter = (event: CollisionEnterEvent): void => {
    const { mtv, gameObject, target } = event;

    if (mtv.x === 0 && mtv.y < 0 && !!gameObject.getComponent(RigidBody)) {
      const movement = target.getComponent(Movement);
      movement.isJumping = false;
    }
  };

  update(options: UpdateOptions): void {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this.gameObjectObserver.forEach((gameObject) => {
      const movement = gameObject.getComponent(Movement);
      const viewDirection = gameObject.getComponent(ViewDirection);

      if (!movement.isMoving) {
        movement.direction = 0;
        return;
      }

      const movementDelta = movement.direction * movement.speed * deltaTimeInSeconds;

      const transform = gameObject.getComponent(Transform);
      transform.offsetX += movementDelta;

      viewDirection.x = movement.direction;

      movement.isMoving = false;
    });
  }
}

MovementSystem.systemName = 'MovementSystem';
