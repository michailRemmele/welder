import { Vector2 } from 'remiz';

const MOVE_LEFT_MSG = 'MOVE_LEFT';
const MOVE_RIGHT_MSG = 'MOVE_RIGHT';
const MOVE_JUMP_MSG = 'MOVE_JUMP';
const COLLISION_ENTER_MSG = 'COLLISION_ENTER';

const ADD_IMPULSE_MSG = 'ADD_IMPULSE';

const TRANSFORM_COMPONENT_NAME = 'transform';
const MOVEMENT_COMPONENT_NAME = 'movement';
const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const VIEW_DIRECTION_COMPONENT_NAME = 'viewDirection';

const JUMP_IMPULSE = -215;

export class MovementSystem {
  constructor(options) {
    this.gameObjectObserver = options.createGameObjectObserver({
      components: [
        TRANSFORM_COMPONENT_NAME,
        MOVEMENT_COMPONENT_NAME,
        VIEW_DIRECTION_COMPONENT_NAME,
      ],
    });
    this.messageBus = options.messageBus;
  }

  update(options) {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this.gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      const movement = gameObject.getComponent(MOVEMENT_COMPONENT_NAME);
      const viewDirection = gameObject.getComponent(VIEW_DIRECTION_COMPONENT_NAME);
      movement.direction = 0;

      const leftMessages = this.messageBus.getById(MOVE_LEFT_MSG, gameObjectId);
      if (leftMessages?.length) {
        movement.direction -= 1;
      }

      const rightMessages = this.messageBus.getById(MOVE_RIGHT_MSG, gameObjectId);
      if (rightMessages?.length) {
        movement.direction += 1;
      }

      const collisionMessages = this.messageBus.getById(COLLISION_ENTER_MSG, gameObjectId);
      if (collisionMessages?.length
        && collisionMessages.at(-1).mtv1.x === 0
        && collisionMessages.at(-1).mtv1.y < 0
        && !!collisionMessages.at(-1).gameObject2.getComponent(RIGID_BODY_COMPONENT_NAME)
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

      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
      transform.offsetX += movementDelta;

      viewDirection.x = movement.direction;
    });
  }
}
