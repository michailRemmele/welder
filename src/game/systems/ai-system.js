import { Vector2 } from 'remiz';

import * as COMPONENTS from './components-consts';
import * as MESSAGES from './messages-consts';

export class AISystem {
  constructor(options) {
    this.gameObjectObserver = options.createGameObjectObserver({
      components: [COMPONENTS.TRANSFORM_COMPONENT_NAME, COMPONENTS.AI_COMPONENT_NAME],
    });
    this.messageBus = options.messageBus;
  }

  updateMovement(gameObject) {
    const ai = gameObject.getComponent(COMPONENTS.AI_COMPONENT_NAME);

    const collisionMessages = this.messageBus.getById(MESSAGES.COLLISION_ENTER_MSG, gameObject.id);
    const shouldTurn = collisionMessages?.some(
      (message) => !!message.gameObject2.getComponent(COMPONENTS.AI_BLOCKER_COMPONENT_NAME),
    );

    if (shouldTurn) {
      ai.direction *= -1;
    }

    this.messageBus.send({
      type: ai.direction === 1 ? MESSAGES.MOVE_RIGHT_MSG : MESSAGES.MOVE_LEFT_MSG,
      id: gameObject.id,
    });
  }

  updateDamage(gameObject) {
    const collisionMessages = this.messageBus.getById(MESSAGES.COLLISION_ENTER_MSG, gameObject.id);
    const collsion = collisionMessages?.find(
      (message) => message.gameObject2.getComponent(COMPONENTS.ATTACK_COMPONENT_NAME),
    );

    if (!collsion) {
      return;
    }

    const rigidBody = gameObject.getComponent(COMPONENTS.RIGID_BODY_COMPONENT_NAME);
    rigidBody.ghost = true;
    gameObject.removeComponent(COMPONENTS.AI_COMPONENT_NAME);
    this.messageBus.send({
      type: MESSAGES.ADD_IMPULSE_MSG,
      value: new Vector2(150 * Math.sign(collsion.mtv1.x), -150),
      gameObject,
      id: gameObject.id,
    });
  }

  update() {
    this.gameObjectObserver.forEach((gameObject) => {
      this.updateMovement(gameObject);
      this.updateDamage(gameObject);
    });
  }
}
