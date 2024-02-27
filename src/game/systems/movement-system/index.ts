import {
  Scene,
  ActorCollection,
  Vector2,
  Transform,
  RigidBody,
  System,
  CollisionEnter,
  AddImpulse,
} from 'remiz';
import type {
  SystemOptions,
  UpdateOptions,
  ActorEvent,
  CollisionEnterEvent,
} from 'remiz';

import {
  Movement,
  ViewDirection,
} from '../../components';
import * as EventType from '../../events';

const JUMP_IMPULSE = -215;

export class MovementSystem extends System {
  private scene: Scene;
  private actorCollection: ActorCollection;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;
    this.actorCollection = new ActorCollection(options.scene, {
      components: [
        Transform,
        Movement,
        ViewDirection,
      ],
    });
  }

  mount(): void {
    this.scene.addEventListener(CollisionEnter, this.handleCollisionEnter);
    this.scene.addEventListener(EventType.MoveLeft, this.handleMoveLeft);
    this.scene.addEventListener(EventType.MoveRight, this.handleMoveRight);
    this.scene.addEventListener(EventType.MoveJump, this.handleJump);
  }

  unmount(): void {
    this.scene.removeEventListener(CollisionEnter, this.handleCollisionEnter);
    this.scene.removeEventListener(EventType.MoveLeft, this.handleMoveLeft);
    this.scene.removeEventListener(EventType.MoveRight, this.handleMoveRight);
    this.scene.removeEventListener(EventType.MoveJump, this.handleJump);
  }

  private handleMoveLeft = (event: ActorEvent): void => {
    const movement = event.target.getComponent(Movement);
    movement.direction = -1;
    movement.isMoving = true;
  };

  private handleMoveRight = (event: ActorEvent): void => {
    const movement = event.target.getComponent(Movement);
    movement.direction = 1;
    movement.isMoving = true;
  };

  private handleJump = (event: ActorEvent): void => {
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
    const { mtv, actor, target } = event;

    const movement = target.getComponent(Movement);
    if (movement === undefined) {
      return;
    }

    if (mtv.x === 0 && mtv.y < 0 && !!actor.getComponent(RigidBody)) {
      movement.isJumping = false;
    }
  };

  update(options: UpdateOptions): void {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this.actorCollection.forEach((actor) => {
      const movement = actor.getComponent(Movement);
      const viewDirection = actor.getComponent(ViewDirection);

      if (!movement.isMoving) {
        movement.direction = 0;
        return;
      }

      const movementDelta = movement.direction * movement.speed * deltaTimeInSeconds;

      const transform = actor.getComponent(Transform);
      transform.offsetX += movementDelta;

      viewDirection.x = movement.direction;

      movement.isMoving = false;
    });
  }
}

MovementSystem.systemName = 'MovementSystem';
