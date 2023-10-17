import {
  Vector2,
  Transform,
  RigidBody,
  System,
} from 'remiz';
import type {
  SystemOptions,
  UpdateOptions,
  GameObjectObserver,
  MessageBus,
} from 'remiz';

import {
  Movement,
  ViewDirection,
} from '../../components';
import type { CollisionEnterMessage } from '../../../types/messages';

const MOVE_LEFT_MSG = 'MOVE_LEFT';
const MOVE_RIGHT_MSG = 'MOVE_RIGHT';
const MOVE_JUMP_MSG = 'MOVE_JUMP';
const COLLISION_ENTER_MSG = 'COLLISION_ENTER';

const ADD_IMPULSE_MSG = 'ADD_IMPULSE';

const JUMP_IMPULSE = -215;

export class MovementSystem extends System {
  private gameObjectObserver: GameObjectObserver;
  private messageBus: MessageBus;

  constructor(options: SystemOptions) {
    super();

    this.gameObjectObserver = options.createGameObjectObserver({
      components: [
        Transform,
        Movement,
        ViewDirection,
      ],
    });
    this.messageBus = options.messageBus;
  }

  update(options: UpdateOptions): void {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this.gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      const movement = gameObject.getComponent(Movement);
      const viewDirection = gameObject.getComponent(ViewDirection);
      movement.direction = 0;

      const leftMessages = this.messageBus.getById(MOVE_LEFT_MSG, gameObjectId);
      if (leftMessages?.length) {
        movement.direction -= 1;
      }

      const rightMessages = this.messageBus.getById(MOVE_RIGHT_MSG, gameObjectId);
      if (rightMessages?.length) {
        movement.direction += 1;
      }

      const collisionMessages = this.messageBus.getById(
        COLLISION_ENTER_MSG,
        gameObjectId,
      ) as Array<CollisionEnterMessage> | undefined;
      if (collisionMessages?.length
        && (collisionMessages.at(-1) as CollisionEnterMessage).mtv1.x === 0
        && (collisionMessages.at(-1) as CollisionEnterMessage).mtv1.y < 0
        && !!collisionMessages.at(-1)?.gameObject2.getComponent(RigidBody)
      ) {
        movement.isJumping = false;
      }

      const jumpMessages = this.messageBus.getById(MOVE_JUMP_MSG, gameObjectId);
      if (jumpMessages?.length && !movement.isJumping) {
        this.messageBus.send({
          type: ADD_IMPULSE_MSG,
          value: new Vector2(0, JUMP_IMPULSE),
          gameObject,
          id: gameObjectId,
        });
        movement.isJumping = true;
      }

      if (movement.direction === 0) {
        return;
      }

      const movementDelta = movement.direction * movement.speed * deltaTimeInSeconds;

      const transform = gameObject.getComponent(Transform);
      transform.offsetX += movementDelta;

      viewDirection.x = movement.direction;
    });
  }
}

MovementSystem.systemName = 'MovementSystem';
