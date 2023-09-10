import { Vector2 } from 'remiz';

import * as COMPONENTS from './components-consts';
import * as MESSAGES from './messages-consts';

export class MovementSystem {
  constructor(options) {
    this.gameObjectObserver = options.createGameObjectObserver({
      components: [
        COMPONENTS.TRANSFORM_COMPONENT_NAME,
        COMPONENTS.MOVEMENT_COMPONENT_NAME,
      ],
    });
    this.messageBus = options.messageBus;
  }

  update(options) {
    const { deltaTime } = options;

    this.gameObjectObserver.forEach((gameObject) => {
      const movement = gameObject.getComponent(COMPONENTS.MOVEMENT_COMPONENT_NAME);
      const transform = gameObject.getComponent(COMPONENTS.TRANSFORM_COMPONENT_NAME);

      movement.direction = 0;

      const rightMessages = this.messageBus.getById(MESSAGES.MOVE_RIGHT_MSG, gameObject.id);
      if (rightMessages?.length) {
        movement.direction += 1;
      }

      const leftMessages = this.messageBus.getById(MESSAGES.MOVE_LEFT_MSG, gameObject.id);
      if (leftMessages?.length) {
        movement.direction -= 1;
      }

      const collisionMessages = this.messageBus
        .getById(MESSAGES.COLLISION_ENTER_MSG, gameObject.id);
      if (collisionMessages?.length
        && collisionMessages.at(-1).mtv1.y < 0
        && collisionMessages.at(-1).mtv1.x === 0
        && !!collisionMessages.at(-1).gameObject2.getComponent(COMPONENTS.RIGID_COMPONENT_NAME)
      ) {
        movement.isJumping = false;
      }

      const jumpMessages = this.messageBus.getById(MESSAGES.MOVE_JUMP_MSG, gameObject.id);
      if (jumpMessages?.length && !movement.isJumping) {
        this.messageBus.send({
          type: MESSAGES.ADD_IMPULSE_MSG,
          value: new Vector2(0, -200),
          gameObject,
          id: gameObject.id,
        });
        movement.isJumping = true;
      }

      if (movement.direction === 0) {
        return;
      }

      transform.offsetX += movement.direction * movement.speed * (deltaTime / 1000);

      movement.viewDirection = movement.direction;
    });
  }
}
